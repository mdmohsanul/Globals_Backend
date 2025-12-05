// routes/encryption.routes.js
import { Router } from "express";
import fs from "fs";
import { ApiResponse } from "../utils/ApiResponse.js";



const router = Router();

router.get("/public-key", (req, res) => {
  const publicKey = fs.readFileSync("public.pem", "utf8");
  return res.status(200).json(
    new ApiResponse(200, { publicKey }, "Public encryption key fetched")
  );
});

export default router;
