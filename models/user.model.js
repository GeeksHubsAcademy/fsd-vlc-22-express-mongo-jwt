
const crypto = require("node:crypto");
const mongoose = require("../config/mongoose.config.js");

const userSchema =  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,

    },

    uuid: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
    },
  }

const UserModel = mongoose.model("Users",userSchema);


module.exports = UserModel;