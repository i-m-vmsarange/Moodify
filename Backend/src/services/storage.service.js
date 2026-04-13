const IMAGEKIT = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const client = new IMAGEKIT({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile({ buffer, filename, path }) {
  const response = await client.files.upload({
    file: await toFile(Buffer.from(buffer), "file"),
    fileName: filename,
    folder: path,
  });

  return response;
}

module.exports = {
  uploadFile,
};
