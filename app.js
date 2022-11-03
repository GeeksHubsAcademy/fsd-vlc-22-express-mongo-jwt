const express = require("express");
const authMiddleware = require('./middleware/auth.middleware.js');
const logMiddleware = require('./middleware/log.middleware.js');
const moviesRouter = require("./routers/movies.router.js");


const app = express();

app.use(express.json());

app.use(logMiddleware);

app.use("/movies", authMiddleware, moviesRouter);


app.use((req, res) =>res.status(404).json({ message: "Not found url -> " + req.url }));

module.exports = app