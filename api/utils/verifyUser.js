import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) next(errorHandler(401, "Unauthorized"));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) next(errorHandler(401, "Unauthorized"));
      req.user = user;
      next();
    });
  } catch (error) {
    next(errorHandler(401, error));
  }
};
