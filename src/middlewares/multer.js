import multer from "multer";
import { ApiResponse } from "../utils/ApiResponse.js";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // temp folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB limit

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
});

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "File size must not exceed 2MB"));
    }
    return res
      .status(400)
      .json(new ApiResponse(400, null, err.message));
  }
  if (err) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, err.message));
  }
  next();
};

export default upload;
