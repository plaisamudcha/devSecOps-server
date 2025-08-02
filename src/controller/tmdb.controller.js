import fetch from "node-fetch";
import dotenv from "dotenv";
import createError from "../util/create-error.util.js";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Debug log to check if API key is loaded
if (!TMDB_API_KEY) {
  console.warn("⚠️  TMDB_API_KEY is not set in environment variables");
}

const tmdbFetch = async (endpoint, res) => {
  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`
  );
  if (!response.ok) createError(500, "Failed to fetch data from TMDB");
  if (response.status === 404) createError(404, "Resource not found on TMDB");
  if (response.status === 401) createError(401, "Unauthorized access to TMDB");
  if (response.status === 403) createError(403, "Forbidden access to TMDB");
  const data = await response.json();
  res.status(200).json({
    results: data.results,
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
  });
};

const tmdbController = {
  getAllMovies: async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}`
      );
      if (!response.ok) createError(500, "Failed to fetch movies from TMDB");
      const data = await response.json();
      if (data.results.length === 0)
        createError(404, "No movies found on TMDB");
      res.status(200).json({
        results: data.results,
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
      });
    } catch (error) {
      next(error);
    }
  },
  searchMovies: async (req, res, next) => {
    try {
      const { query } = req.query;
      if (!query) createError(400, "Query parameter is required");
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok)
        createError(500, "Failed to fetch search results from TMDB");
      const data = await response.json();
      if (data.results.length === 0)
        createError(404, "No movies found for the given query");
      res.status(200).json({
        results: data.results,
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
      });
    } catch (error) {
      next(error);
    }
  },
  getPopularMovies: async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const endpoint = `/movie/popular?page=${page}`;
      await tmdbFetch(endpoint, res);
    } catch (error) {
      next(error);
    }
  },
  getTopRatedMovies: async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const endpoint = `/movie/top_rated?page=${page}`;
      await tmdbFetch(endpoint, res);
    } catch (error) {
      next(error);
    }
  },
  getUpcomingMovies: async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const endpoint = `/movie/upcoming?page=${page}`;
      await tmdbFetch(endpoint, res);
    } catch (error) {
      next(error);
    }
  },
  getMovieDetailById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok)
        createError(500, "Failed to fetch movie details from TMDB");
      const data = await response.json();
      if (!data) createError(404, "Movie not found on TMDB");
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};

export default tmdbController;
