// src/routes/sermons.js
const express = require("express");
const router = express.Router();
const { uploadSermon, getSermons } = require("../controllers/sermonController");

// Make sure this is a function, not undefined
router.get("/", getSermons);
router.post("/", uploadSermon);

module.exports = router;
