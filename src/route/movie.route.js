import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import movieController from "../controller/movie.controller.js";
import validate from "../validation/validate.validatation.js";
import movieSchema from "../validation/movieSchema.validation.js";

const movieRouter = express.Router();

movieRouter.use(authMiddleware.checkToken); // Apply authentication middleware to all movie routes

movieRouter.get("/my-list", movieController.getAllMovies);
movieRouter.get("/my-list/:id", movieController.getMovieById);
movieRouter.post(
  "/add-to-list",
  validate(movieSchema.create),
  movieController.addMovieToList
);
movieRouter.put(
  "/update/:id",
  validate(movieSchema.update),
  movieController.updateMovie
);
movieRouter.delete("/remove/:id", movieController.deleteMovie);

export default movieRouter;
