const UserModel = require("../models/user.model");
const crypto = require("node:crypto");

function assertValidPasswordService(pass) {
  if (pass.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  // validate it has one lower case letter
  if (!pass.match(/[a-z]/)) {
    throw new Error("Password must have at least one lower case letter");
  }
  // validate it has one upper case letter
  if (!pass.match(/[A-Z]/)) {
    throw new Error("Password must have at least one upper case letter");
  }
  // validate it has one number
  if (!pass.match(/[0-9]/)) {
    throw new Error("Password must have at least one number");
  }
}

async function assertEmailIsUniqueService(email) {
  // validate email is unique
  const user = await UserModel.findOne({ email: email });
  if (user) {
    throw new Error("Email is already registered");
  }
}



async function createUserService(userBody) {
  delete userBody.uuid;
  const hash = encryptPassword(userBody.password);
  userBody.password = hash;
  const user = new UserModel(userBody);
  await user.save();
  return user;
}

function assertEmailIsValid(email) {
  // must validate a valid email
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // return emailRegex.test(email);
  const isValid = email.match(emailRegex);
  if (!isValid) {
    throw new Error("Email is invalid");
  }
}

function encryptPassword(password) {
  const hash = crypto
    .createHmac("sha512", 'no salt for now // TODO: REALLY NEED TO ADD SALT?')
    .update(password)
    .digest("base64");
  return hash;
}

async function isValidUserAndPassword(user, pass) {
  const userFound = await UserModel.findOne({ email: user });
  if (userFound) {
    const hash = encryptPassword(pass);
    return hash === userFound.password;
  }
  return false;
}

module.exports = {
  assertValidPasswordService,
  assertEmailIsUniqueService,
  assertEmailIsValid,
  createUserService,
  isValidUserAndPassword,
  encryptPassword,
};
