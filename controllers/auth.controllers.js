const UserModel = require("../models/user.model.js");
const {
  assertValidPasswordService,
  assertEmailIsUniqueService,
  assertEmailIsValid,
  createUserService,
  encryptPassword,
} = require("../services/auth.service.js");

const jsonwebtoken = require("jsonwebtoken");

async function authLoginController(req, res) {
  const { email, password } = req.body;
  const userFound = await UserModel.findOne({ email: email });
  if (!userFound) {
    res.status(401).json({ message: "Password or email is incorrect" });
    return;
  }
  const hashedPassword = encryptPassword(password);
  if (hashedPassword !== userFound.password) {
    res.status(401).json({ message: "Password or email is incorrect" });
    return;
  }

  const secret = process.env.JWT_SECRET || '';

  if (secret.length < 10) {
    throw new Error("JWT_SECRET is not set");
  }

  const jwt = jsonwebtoken.sign({
    uuid: userFound.uuid,
    email: userFound.email,
  }, secret);

  res.status(200).json({
    message: "Login successful",
    jwt: jwt,
  });
}

async function authRegisterController(req, res) {
  const body = req.body;
  // validate password
  try {
    assertValidPasswordService(body.password);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid password: " + error.message });
    return;
  }
  // validate email is valid
  try {
    assertEmailIsValid(body.email);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Email is invalid: " + error.message });
    return;
  }
  // validate email is unique
  try {
    await assertEmailIsUniqueService(body.email);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Email is already registered: " + error.message,
    });
    return;
  }
  // save user
  try {
    const userCreated = await createUserService(body);
    delete userCreated.password;
    delete userCreated._id;
    res.status(201).json(userCreated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  authLoginController,
  authRegisterController,
};
