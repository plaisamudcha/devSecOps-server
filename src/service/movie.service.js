import prisma from "../config/prisma.config.js";

const movieService = {
  getAllMovies: async (userId) => {
    return await prisma.movie.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  getMoviebyId: async (userId, movieId) => {
    return await prisma.movie.findFirst({
      where: {
        id: movieId,
        userId: userId,
      },
    });
  },
  createMovie: async (userId, movieData) => {
    return await prisma.movie.create({
      data: {
        ...movieData,
        userId: userId,
      },
    });
  },
  updateMovie: async (userId, movieId, movieData) => {
    return await prisma.movie.update({
      where: {
        id: movieId,
        userId: userId,
      },
      data: movieData,
    });
  },
  deleteMovie: async (userId, movieId) => {
    return await prisma.movie.delete({
      where: {
        id: movieId,
        userId: userId,
      },
    });
  },
};

export default movieService;
