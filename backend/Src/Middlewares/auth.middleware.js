import {asyncHandler} from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../Models/user.Model.js";

const checkJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If no token found, return unauthorized error
    if (!token) {
      return next(new ApiError(401, "Unauthorized: No token provided"));
    }

    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user by decoded _id and exclude sensitive fields
    const user = await User.findById(decoded?._id).select("-password -refreshToken");

    // If user not found, return unauthorized error
    if (!user) {
      return next(new ApiError(401, "Unauthorized: User not found"));
    }

    // Attach user object to request for downstream use
    req.user = user;

    // Continue to next middleware/controller
    next();
  } catch (error) {
    // If verification fails or any error occurs, return unauthorized error
    next(new ApiError(401, "Unauthorized: Invalid or expired token"));
  }
});

export default checkJWT;

