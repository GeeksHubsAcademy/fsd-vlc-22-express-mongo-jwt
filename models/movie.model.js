
const crypto = require("node:crypto");
const mongoose = require("../config/mongoose.config.js");


const movieSchema =  {
    title: {
      type: String,
      required: true,
      unique: true,
      minLength: 2,
    },
    uuid: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
    },
    year: Number,
    director: String,
    genre: String,
    rating: Number,
  }

const MovieModel = mongoose.model("Movie",movieSchema);


module.exports = MovieModel;