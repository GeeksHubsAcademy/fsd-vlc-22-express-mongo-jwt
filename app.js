const express = require("express");
const { authBearerMiddleware, isValidRoleAdmin, isValidRole } = require("./middleware/auth.middleware.js");
const logMiddleware = require("./middleware/log.middleware.js");
const moviesRouter = require("./routers/movies.router.js");
const authRouter = require("./routers/auth.router.js");

const app = express();

app.use(express.json());

app.use(logMiddleware);

app.use("/auth", authRouter);

app.use("/movies", authBearerMiddleware, isValidRole('user'), moviesRouter);

app.get(
  "/admin",
  authBearerMiddleware,
  isValidRole('admin'),
  (req, res) =>
    res.json({ message: "your are the fucking boss -> " + req.auth.email }),
);

app.use((req, res) =>
  res.status(404).json({ message: "Not found url -> " + req.url })
);

module.exports = app;
