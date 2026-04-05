const mongoose = require("mongoose");

function connectToDb() {
  mongoose.connect(process.env.MONGODB_URI).then((res) => {
    console.log("Connected to MONGO DB");
  });
}

module.exports = connectToDb;
