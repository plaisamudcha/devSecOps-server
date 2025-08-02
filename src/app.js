import express from "express";
import morgan from "morgan";
import cors from "cors";
import notFoundMiddleware from "./middleware/not-found.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRouter from "./route/auth.route.js";
import movieRouter from "./route/movie.route.js";
import tmdbRouter from "./route/tmdb.route.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/db-test", (req, res) => {
  try {
    res.status(200).send("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).send("Database connection error");
  }
});

app.use("/api/auth", authRouter);
app.use("/api/movies", movieRouter);
app.use("/api/tmdb", tmdbRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
