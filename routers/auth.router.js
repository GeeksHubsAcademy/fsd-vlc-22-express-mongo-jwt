const express = require("express");
const authRouter = express.Router();

const {
    authLoginController,
    authRegisterController,
} = require("../controllers/auth.controllers.js");


authRouter.post("/login", authLoginController);
authRouter.post("/register", authRegisterController);

module.exports = authRouter;
