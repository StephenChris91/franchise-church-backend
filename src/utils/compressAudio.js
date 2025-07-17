const { spawn } = require("child_process");
const ffmpegPath = require("ffmpeg-static");

/**
 * Compresses an MP3 audio file using FFmpeg at 96kbps.
 * @param {string} inputPath - Path to the input .mp3 file
 * @param {string} outputPath - Path to write the compressed .mp3 file
 * @returns {Promise<void>}
 */
const compressAudio = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      "-y", // ✅ Automatically overwrite
      "-i",
      inputPath,
      "-b:a",
      "96k",
      outputPath,
    ]);

    ffmpeg.stderr.on("data", (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
};

module.exports = { compressAudio };
