const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { blacklistModel } = require("../models/blacklist.model");

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
  res.status(201).json({
    message: "User registered successfully!!",
    user: {
      username: user.username,
      email: user.email,
    },
  });
}
async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const dbUser = await userModel
    .findOne({
      $or: [
        {
          username,
        },
        {
          email,
        },
      ],
    })
    .select("+password");
  // To avoid the phishing attack, we are sending the same message for both cases (user not found and invalid password)
  if (!dbUser) {
    res.status(400).json({
      message: "Invalid credentials!!!",
    });
  }
  const validPassword = await bcrypt.compare(password, dbUser.password);

  if (!validPassword) {
    res.status(400).json({
      message: "Invalid credentials!!!",
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
async function getUser(req, res) {
  const user = req.user;

  const dbUser = await userModel.findById(user.id);

  res.status(200).json({
    message: "Current logged in user",
    user: dbUser,
  });
}
async function logoutUser(req, res) {
  const user = req.user;
  const token = req.cookies.jwt_token;
  res.clearCookie("jwt_token");

  const response = await blacklistModel.create({ token });

  if (!response) {
    res.status(500).json({
      message: "Internal server error!!!",
    });
  }

  res.status(200).json({
    message: `${user.username} is loggedout successfully!!!`,
  });
}
module.exports = {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
};
