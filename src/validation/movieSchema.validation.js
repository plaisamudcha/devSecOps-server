import { number, object, ref, string } from "yup";
import MovieStatus from "../../generated/prisma/client.js";

const movieStatus = Object.values(MovieStatus);

const movieSchema = {
  create: object({
    userId: string().required("User ID is required"),
    movieId: number()
      .integer("Movie ID must be an integer")
      .required("Movie ID is required"),
    status: string()
      .oneOf(movieStatus, "Invalid movie status")
      .required("Movie status is required"),
    note: string().max(500, "Note must be at most 500 characters"),
  }),
  update: object({
    userId: string().required("User ID is required"),
    movieId: number()
      .integer("Movie ID must be an integer")
      .required("Movie ID is required"),
    status: string()
      .oneOf(movieStatus, "Invalid movie status")
      .required("Movie status is required"),
    note: string().max(500, "Note must be at most 500 characters"),
  }),
};

export default movieSchema;
