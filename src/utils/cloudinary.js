import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType, // <-- dynamic now
      folder: "Globals",
    });

    fs.unlinkSync(localFilePath); // delete local temp
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};


export {uploadOnCloudinary}
