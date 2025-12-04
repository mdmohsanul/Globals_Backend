import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload, { handleMulterError } from "../middlewares/multer.js";
import decryptPayload from "../middlewares/decryptPayload.js";
import {
  createSubmission,
  getMySubmissions,
  
} from "../controllers/submission.controller.js";


const router = Router();

router.post(
  "/",
  verifyJWT,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  handleMulterError,

  createSubmission
);

router.get("/my", verifyJWT, getMySubmissions);
// router.get("/:id", verifyJWT, getSubmissionById);

export default router;
