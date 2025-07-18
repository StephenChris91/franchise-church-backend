// src/routes/sermons.js

const express = require("express");
const multer = require("multer");
const { uploadSermon, getSermons } = require("../controllers/sermonController");

const router = express.Router();

// Use in-memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });

// Handle sermon uploads with file support
router.post(
  "/",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 },
  ]),
  uploadSermon
);

// Handle fetching sermons (with signed URLs)
router.get("/", getSermons);

module.exports = router;
