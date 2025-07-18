const fs = require("fs").promises;
const os = require("os");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const prisma = require("../prisma/client");
const { supabaseAdmin } = require("../utils/supabaseAdmin");
const compressAudio = require("../utils/compressAudio");

exports.uploadSermon = async (req, res) => {
  try {
    const { title, speaker, date, duration, categories } = req.body;

    const audioFile = req.files?.audio?.[0];
    const thumbnailFile = req.files?.thumbnailFile?.[0];

    if (!title || !date || !audioFile) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("🎧 Uploading sermon:", title);

    // Save raw audio temporarily
    const tempAudioPath = path.join(
      os.tmpdir(),
      `${uuidv4()}-${audioFile.originalname}`
    );
    await fs.writeFile(tempAudioPath, audioFile.buffer);

    // Compress audio
    const compressedName = `${uuidv4()}-compressed.mp3`;
    const compressedPath = path.join(os.tmpdir(), compressedName);
    await compressAudio(tempAudioPath, compressedPath);

    // Upload compressed audio to Supabase
    const { error: audioErr } = await supabaseAdmin.storage
      .from("sermons-audio")
      .upload(compressedName, await fs.readFile(compressedPath), {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (audioErr) throw audioErr;

    const { data: signedAudio } = await supabaseAdmin.storage
      .from("sermons-audio")
      .createSignedUrl(compressedName, 60 * 60 * 24 * 7); // 7 days

    // Upload thumbnail if available
    let thumbnailName = null;
    if (thumbnailFile) {
      thumbnailName = `${uuidv4()}-${thumbnailFile.originalname}`;
      const { error: thumbErr } = await supabaseAdmin.storage
        .from("sermons-thumbnail")
        .upload(thumbnailName, thumbnailFile.buffer, {
          contentType: thumbnailFile.mimetype,
          upsert: true,
        });
      if (thumbErr) throw thumbErr;
    }

    // Insert into database
    console.log("🗃 Inserting record into database...");
    const sermon = await prisma.sermons.create({
      data: {
        title,
        speaker,
        date: new Date(date),
        duration: parseFloat(duration),
        audio_url: compressedName,
        thumbnail: thumbnailName || "",
        categories: categories ? categories.split(",") : [],
      },
    });

    res.status(200).json({ message: "Sermon uploaded", sermon });
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getSermons = async (req, res) => {
  try {
    const sermons = await prisma.sermons.findMany();

    const signedSermons = await Promise.all(
      sermons.map(async (sermon) => {
        // 🎧 Signed Audio URL
        const { data: signedAudio, error: audioErr } =
          await supabaseAdmin.storage
            .from("sermons-audio")
            .createSignedUrl(sermon.audio_url, 60 * 60); // 1 hour

        // 🖼️ Signed Thumbnail URL
        let signedThumbnail = "/assets/sermon-fallback.jpg"; // default
        if (sermon.thumbnail) {
          const { data: thumbData, error: thumbErr } =
            await supabaseAdmin.storage
              .from("sermons-thumbnail")
              .createSignedUrl(sermon.thumbnail, 60 * 60);
          if (!thumbErr && thumbData?.signedUrl) {
            signedThumbnail = thumbData.signedUrl;
          }
        }

        return {
          ...sermon,
          audioUrl: signedAudio?.signedUrl || null,
          thumbnail: signedThumbnail,
        };
      })
    );

    console.log("✅ Signed sermons fetched:", signedSermons.length);
    res.status(200).json({ sermons: signedSermons });
  } catch (error) {
    console.error("🔥 getSermons error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
