const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/demo-pelis");

module.exports = mongoose;