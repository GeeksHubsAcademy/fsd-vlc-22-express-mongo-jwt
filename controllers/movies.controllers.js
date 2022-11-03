
const MovieModel = require("../models/movie.model.js");
const {movieFindOne} = require("../services/movies.services.js")



const moviesGetAllController = async (req, res) => {
  const queryParameters = req.query || {};
  const movies = await MovieModel.find(queryParameters);
  res.json(movies);
};

const moviesGetOneController = async (req, res) => {
  const { id } = req.params;
  const movieFound = await movieFindOne(id)
  if (movieFound) {
    res.json(movieFound);
  } else {
    res.status(204).json({ message: "Movie not found" });
  }
};

const moviesCreateController = async (req, res) => {
  try {
    const movie = req.body;
    const movieCreated = new MovieModel(movie);
    await movieCreated.save();
    res.status(201).json(movieCreated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const moviesDeleteController = async (req, res) => {
  const { id } = req.params;
  const movieFound = await movieFindOne(id)
  if (movieFound) {
    await movieFound.remove();
    res.json({ message: "Movie deleted" });
  } else {
    res.status(204).json({ message: "Movie not found" });
  }
};
const moviesPutController = async (req, res) => {
  const { id } = req.params;
  const movie = req.body;
  const movieFound = await movieFindOne(id)
  if (movieFound) {
    movie.uuid = id;
    await movieFound.replaceOne(movie);
    res.json(movie);
  } else {
    res.status(204).json({ message: "Movie not found" });
  }
};
const moviesPatchController = async (req, res) => {
  const { id } = req.params;
  const movie = req.body;
  const movieFound = await movieFindOne(id)
  if (movieFound) {
    for (const key in movie) {
      movieFound[key] = movie[key];
    }
    await movieFound.save();
    res.json(movieFound);
  } else {
    res.status(204).json({ message: "Movie not found" });
  }
};

module.exports = {
    moviesGetAllController,
    moviesGetOneController,
    moviesCreateController,
    moviesDeleteController,
    moviesPutController,
    moviesPatchController,
};
