// routes/contact.js
const express = require("express");
const router = express.Router();
const { sendCounsellingRequest } = require("../controllers/contactController");

router.post("/", sendCounsellingRequest);

module.exports = router;
