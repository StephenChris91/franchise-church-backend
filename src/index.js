const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const sermonsRouter = require("./routes/sermons");

const app = express();

// CORS (Production-safe)
const allowedOrigins = ["*"];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/sermons", sermonsRouter);

app.get("/api/health", (_, res) => res.json({ status: "OK" }));

module.exports = app;
