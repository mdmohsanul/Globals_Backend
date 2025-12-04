import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getCurrentUser,
  refreshAccessToken
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
// secured Routes

router.route("/refresh").post(verifyJWT, refreshAccessToken);
router.route("/me").get(verifyJWT, getCurrentUser);



router.route("/logout").post(verifyJWT, logoutUser);


export default router;
