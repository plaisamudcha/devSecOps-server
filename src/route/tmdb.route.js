import express from "express";
import tmdbController from "../controller/tmdb.controller.js";

const tmdbRouter = express.Router();

tmdbRouter.get("/get-all-movies", tmdbController.getAllMovies);
tmdbRouter.get("/search", tmdbController.searchMovies);
tmdbRouter.get("/popular", tmdbController.getPopularMovies);
tmdbRouter.get("/top-rated", tmdbController.getTopRatedMovies);
tmdbRouter.get("/upcoming", tmdbController.getUpcomingMovies);
tmdbRouter.get("/movie/:id", tmdbController.getMovieDetailById);

export default tmdbRouter;
