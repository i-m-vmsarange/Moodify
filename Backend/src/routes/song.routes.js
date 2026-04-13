const express = require("express");
const songRouter = express.Router();
const songController = require("../controllers/song.controller");
const upload = require("../middlewares/upload.middleware");
/**
 * POST
 * upload songs using following API
 */

songRouter.post("/", upload.single("song"), songController.uploadSong);

module.exports = songRouter;
