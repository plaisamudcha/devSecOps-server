import jwt from "jsonwebtoken";
import createError from "./create-error.util.js";

const genTokenJWT = {
  loginToken: (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
  },
  refreshToken: (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      algorithm: "HS256",
      expiresIn: "30d",
    });
  },
  resetToken: (payload) => {
    return jwt.sign(payload, process.env.JWT_RESET_SECRET, {
      algorithm: "HS256",
      expiresIn: "15m",
    });
  },
  verifyToken: (token, secret) => {
    try {
      return jwt.verify(token, secret, { algorithms: ["HS256"] });
    } catch (error) {
      createError(401, "Invalid or expired token");
    }
  },
};

export default genTokenJWT;
