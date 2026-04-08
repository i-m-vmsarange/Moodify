const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model").blacklistModel;

async function authUser(req, res, next) {
  const token = req.cookies.jwt_token;

  if (!token) {
    res.status(409).json({
      message: "Invalid token!!",
    });
  }
  const isTokenBlacklisted = await blacklistModel.findOne({ token });

  if (isTokenBlacklisted) {
    res.status(409).json({
      message: "Invalid token!!",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  authUser,
};
