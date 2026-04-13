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

module.exports = {
  uploadSong,
};
