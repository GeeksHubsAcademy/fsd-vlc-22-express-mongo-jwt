const express = require("express");
const moviesRouter = express.Router();

const {
    moviesGetAllController,
    moviesGetOneController,
    moviesCreateController,
    moviesDeleteController,
    moviesPutController,
    moviesPatchController,
} = require("../controllers/movies.controllers.js");

moviesRouter.get("/", moviesGetAllController);
moviesRouter.get("/:id", moviesGetOneController);
moviesRouter.post("/", moviesCreateController);
moviesRouter.delete("/:id", moviesDeleteController);
moviesRouter.put("/:id", moviesPutController);
moviesRouter.patch("/:id", moviesPatchController);

module.exports = moviesRouter;
