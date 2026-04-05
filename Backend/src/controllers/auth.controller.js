const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const dbUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (dbUser) {
    res.status(409).json({
      message: "User already exists!!!",
      user: {
        dbUser,
      },
    });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  res.cookie("jwt_token", token);
  res.status(200).json({
    message: "User registered successfully!!",
    user: {
      username: user.username,
      email: user.email,
    },
  });
}
async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const dbUser = await userModel.findOne({
    $or: [
      {
        username,
      },
      {
        email,
      },
    ],
  });
  if (!dbUser) {
    res.status(409).json({
      message: "User with given username or email does not exist!!",
    });
  }
  const validPassword = await bcrypt.compare(password, dbUser.password);

  if (!validPassword) {
    res.status(409).json({
      message: "Invalid password!!!",
    });
  }
  const token = jwt.sign(
    {
      id: dbUser._id,
      username: dbUser.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  res.cookie("jwt_token", token);
  res.status(200).json({
    message: "User logged in successfully!!!",
  });
}
module.exports = {
  registerUser,
  loginUser,
};
