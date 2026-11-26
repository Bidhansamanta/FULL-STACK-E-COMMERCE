import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Verify JSON WEB TOKEN
const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies.refreshToken ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new Error("UnAuthorized User Please Login First");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const newUser = await User.findById(decodedToken?.id);

    if (!newUser) {
      throw new Error("User Not Found");
    }

    req.user = newUser;
    next();
  } catch (error) {
    throw new Error("Inter Server Error", error);
  }
};


// Check Role
const checkRole = async (req, res, next) => {
  try {
    const { user } = req;

    if (user.role === "superAdmin") {
      next();
    } else {
      return res.status(400).json({ message: "UnAuthorized User" });
    }
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
};

export { verifyJWT, checkRole };
