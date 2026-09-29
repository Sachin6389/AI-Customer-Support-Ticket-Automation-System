import { v2 as Clundinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
Clundinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const UploudOnCloundinary = async (localPath) => {
  try {
    if (!localPath) {
      return null;
    }
    
    const response = await Clundinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    return  response.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message)
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch (e) {
        console.error("Could not delete local file:", e.message);
      }
    }
    // Return a fallback image instead of breaking the entire app
    return { url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80" };
  }
};
const destroyoncloundinary = async (publicId) => {
  try {
    if (!publicId) {
      return null;
    }
    const response = await Clundinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    console.log("Error is detecting on delete file on cloudinary", error);
    return null;
  }
};

export { UploudOnCloundinary, destroyoncloundinary };