const express = require("express");
const { uploadSermon } = require("../controllers/sermonController");

const router = express.Router();

router.post("/", uploadSermon);

// Optional test route
router.get("/", (req, res) => {
  res.status(200).json({ message: "GET /api/sermons works!" });
});

module.exports = router;
