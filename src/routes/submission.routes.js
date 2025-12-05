import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload, { handleMulterError } from "../middlewares/multer.js";
import {
  createSubmission,
  getMySubmissions,
} from "../controllers/submission.controller.js";
import hybridDecryptPayload from "../middlewares/hybridDecryptPayload.js";

const router = Router();

router.route("/").post(
  verifyJWT,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  handleMulterError,
  hybridDecryptPayload,
  createSubmission
);

router.route("/allSubmission").get(getMySubmissions);



export default router;
