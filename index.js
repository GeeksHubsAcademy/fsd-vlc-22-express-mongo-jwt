const express = require("express");
const app = express();
const port = 3000;
const crypto = require("node:crypto");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/demo-pelis");

const MovieModel = mongoose.model("Movie", {
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
});

const moviesRouter = express.Router();

moviesRouter.get("/", async (req, res) => {
  const movies = await MovieModel.find({});
  res.json(movies);
});
moviesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const movieFound = await MovieModel.findOne({ uuid: id });
  if (movieFound) {
    res.json(movieFound);
  } else {
    res.status(204).json({ message: "Movie not found" });
  }
});
moviesRouter.post("/", async (req, res) => {
  try {
    const movie = req.body;
    const movieCreated = new MovieModel(movie);
    await movieCreated.save();
    res.status(201).json(movieCreated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
moviesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const movieFound = await MovieModel.findOne({ uuid: id });
  if (movieFound) {
    await movieFound.remove();
    res.json({ message: "Movie deleted" });
  } else {
    res.status(204).json({ message: "Movie not found" });
  }
});
moviesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const movie = req.body;
  const movieFound = await MovieModel.findOne({ uuid: id });
  if (movieFound) {
    movie.uuid = id;
    await movieFound.replaceOne(movie);
    res.json(movie);
  } else {
    res.status(204).json({ message: "Movie not found" });
  }
});
moviesRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const movie = req.body;
  const movieFound = await MovieModel.findOne({ uuid: id });
  if (movieFound) {
    for (const key in movie) {
      movieFound[key] = movie[key];
    }
    await movieFound.save();
    res.json(movieFound);
  } else {
    res.status(204).json({ message: "Movie not found" });
  }
});

app.use(express.json());

const logMiddleware = (req, res, next) => {
  console.log("Request received", req.method, req.url);
  next();
};
app.use(logMiddleware);

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  let isAuthorized = false;
  const [type, token] = authorization.split(" ");
  if (type !== "basic") {
    res.status(401).json({ message: "You are not authenticated" });
    return;
  }
  const userAndPass = atob(token);
  const [user, pass] = userAndPass.split(":");
  if (user === "Alladin" && pass === "open sesame") {
    isAuthorized = true;
  }
  if (isAuthorized) {
    next();
  } else {
    res.status(401).json({ message: "You are not authenticated" });
  }
};

app.use("/movies", authMiddleware, moviesRouter);

app.use(authMiddleware);
const getRootController = (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
};
app.get("/", getRootController);

const NotFoundController = (req, res) =>
  res.status(404).send("404 - Not Found");

app.use(NotFoundController);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
