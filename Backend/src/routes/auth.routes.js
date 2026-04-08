const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");

/**
 * @route POST
 * @description to register user
 */
authRouter.post("/register", authController.registerUser);

/**
 * @route POST
 * @description to login user in the app
 */
authRouter.post("/login", authController.loginUser);

/**
 * @route GET/
 * @description to know the details of current logged in user
 */
authRouter.get("/get-me", authUser, authController.getUser);

/**
 * @route POST
 * @description to logout user from the app
 */
authRouter.get("/logout", authUser, authController.logoutUser);
module.exports = authRouter;
