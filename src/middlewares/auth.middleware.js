import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import dotenv from "dotenv";
import { User } from "../models/User.model.js";

dotenv.config();

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // 1. Try reading token from cookies (primary method)
  let token = req.cookies?.accessToken;

  // 2. Fallback to Authorization header (optional)
  const bearerHeader = req.headers.authorization;
  if (!token && bearerHeader?.startsWith("Bearer ")) {
    token = bearerHeader.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized: Access token missing");
  }

  // 3. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  // 4. Find user
  const user = await User.findById(decoded?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  // 5. Attach user to the request
  req.user = user;

  next();
});
