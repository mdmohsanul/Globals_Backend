import fs from "fs";
import path from "path";
import { supabase } from "../lib/supabaseClient.js";

export const uploadFileToSupabase = async (localPath, bucket, userId) => {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const fileExt = path.extname(localPath);
    const fileName = `${userId}-${Date.now()}${fileExt}`;

    const uploadPath = fileName;


    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uploadPath, fileBuffer, {
        contentType: getMimeType(fileExt),
        upsert: false,
      });

    if (error) throw error;

    // delete local file
    fs.unlinkSync(localPath);

    // get public URL
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadPath);

    return publicUrl.publicUrl;
  } catch (err) {
    console.error("Supabase upload error:", err);
    return null;
  }
};

function getMimeType(ext) {
  const map = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return map[ext] || "application/octet-stream";
}
