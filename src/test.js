import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    const path = "C:/Users/LENOVO/Downloads/Mohsanul_Hoda_Resume.pdf"; // must be a real file

    const res = await cloudinary.uploader.upload(path, {
      resource_type: "raw",
      type: "upload",
      folder: "TestPDF",
      format: "pdf",
    });

    console.log("Upload success URL:", res.secure_url);
  } catch (err) {
    console.error("Cloudinary upload error:");
    console.error(err); // this will show http_code/message/etc. [web:24][web:72]
  }
})();
