const express = require("express");
const { uploadSermon, getSermons } = require("../controllers/sermonController");

const router = express.Router();

router.get("/", getSermons);
router.post("/", uploadSermon);

module.exports = router;
