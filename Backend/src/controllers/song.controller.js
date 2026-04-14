const id3 = require("node-id3");
const { uploadFile } = require("../services/storage.service.js");
const songModel = require("../models/song.model.js");

async function uploadSong(req, res) {
  const song = id3.read(req.file.buffer);

  const { originalname, buffer } = req.file;
  const mood = req.body.mood;

  const imgName = song.title;
  const imageBuffer = song.image.imageBuffer;
  const imgFolder = "/cohort2/moodify/posters";

  const path = "/cohort2/moodify/songs/";

  const [songFile, imgFile] = await Promise.all([
    uploadFile({ buffer, filename: originalname, path }),
    uploadFile({ buffer: imageBuffer, filename: imgName, path: imgFolder }),
  ]);

  const response = await songModel.create({
    songUrl: songFile.url,
    posterUrl: imgFile.url,
    songTitle: song.title,
    mood,
  });

  return res.status(201).json({
    message: "Song uploaded successfully!!",
    response,
  });
}
async function getSong(req, res) {
  const { mood } = req.body;

  const song = await songModel.findOne({
    mood,
  });

  if (!song) {
    return res.status(404).json({
      message: "Song with the given mood not found!!",
    });
  }

  return res.status(200).json({
    message: "Song fetched successfully!!",
    song,
  });
}
module.exports = {
  uploadSong,
  getSong,
};
