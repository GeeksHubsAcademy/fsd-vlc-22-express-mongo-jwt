const express = require("express");
const { authBearerMiddleware } = require("./middleware/auth.middleware.js");
const logMiddleware = require("./middleware/log.middleware.js");
const moviesRouter = require("./routers/movies.router.js");
const authRouter = require("./routers/auth.router.js");

const app = express();

app.use(express.json());

app.use(logMiddleware);

app.use("/auth", authRouter);


app.use("/movies",authBearerMiddleware, moviesRouter);

app.use((req, res) =>
  res.status(404).json({ message: "Not found url -> " + req.url })
);

module.exports = app;
