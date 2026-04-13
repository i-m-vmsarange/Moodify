const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  songUrl: {
    type: String,
    required: [true, "Song url is required!!"],
  },
  posterUrl: {
    type: String,
    required: [true, "Thumbnail is required!!"],
  },
  songTitle: {
    type: String,
    required: [true, "Song title is required!!"],
  },
  mood: {
    type: String,
    required: [true, "song mood is required!!"],
  },
});

const songModel = mongoose.model("song", songSchema);

module.exports = songModel;
