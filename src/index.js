// index.js
const express = require("express");
const app = express();
const cors = require("cors");
const sermonsRoutes = require("./routes/sermons");
const contactRoutes = require("./routes/contact");

app.use(
  cors({
    origin: "*", // Or restrict to your frontend domain
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.use("/api/sermons", sermonsRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("Franchise Church Backend is running 🚀");
}); // Important: this must match exactly what frontend calls

app.get("/", (req, res) => res.send("Franchise Church API running"));

module.exports = app;
