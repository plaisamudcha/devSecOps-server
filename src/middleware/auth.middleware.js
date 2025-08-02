import createError from "../util/create-error.util.js";
import genTokenJWT from "../util/jwt.util.js";

const authMiddleware = {
  checkToken: (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(createError(401, "Access token is required"));
    }
    const payload = genTokenJWT.verifyToken(token, process.env.JWT_SECRET);
    if (payload.exp * 1000 < Date.now()) {
      return next(createError(401, "Access token has expired"));
    }
    req.user = payload;
    next();
  },
};

export default authMiddleware;
