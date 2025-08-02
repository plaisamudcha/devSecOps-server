import movieService from "../service/movie.service.js";

const movieController = {
  getAllMovies: async (req, res) => {
    const userId = req.user.id;
    const movies = await movieService.getAllMovies(userId);
    res.status(200).json(movies);
  },
  getMovieById: async (req, res) => {
    const userId = req.user.id;
    const movieId = parseInt(req.params.id);
    const movie = await movieService.getMoviebyId(userId, movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  },
  addMovieToList: async (req, res) => {
    const userId = req.user.id;
    const movieData = req.body;
    const newMovie = await movieService.createMovie(userId, movieData);
    res
      .status(201)
      .json({ message: "Movie added successfully", movie: newMovie });
  },
  updateMovie: async (req, res) => {
    const userId = req.user.id;
    const movieId = parseInt(req.params.id);
    const movieData = req.body;
    const updatedMovie = await movieService.updateMovie(
      userId,
      movieId,
      movieData
    );
    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res
      .status(200)
      .json({ message: "Movie updated successfully", movie: updatedMovie });
  },
  deleteMovie: async (req, res) => {
    const userId = req.user.id;
    const movieId = parseInt(req.params.id);
    const deletedMovie = await movieService.deleteMovie(userId, movieId);
    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(204).json({ message: "Movie deleted successfully" });
  },
};

export default movieController;
