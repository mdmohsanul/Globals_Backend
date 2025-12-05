import { Router } from "express";
import {
  getActiveForm,
  getFormById,
  createForm,
  deactivateForm,
} from "../controllers/form.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();



router.route("/active").get(getActiveForm);

router.route("/:id").get(getFormById);

// For Admin — create/update/deactivate a form schema
router.route("/").post(verifyJWT,createForm)

router.route("/:id/deactivate").patch(verifyJWT,deactivateForm)

export default router;
