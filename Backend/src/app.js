const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const songRouter = require("../src/routes/song.routes");

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);

module.exports = app;
