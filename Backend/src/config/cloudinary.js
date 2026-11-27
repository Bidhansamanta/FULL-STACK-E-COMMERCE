import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localPath) => {
  try {
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    console.log("Cloudinary Connected Successfully");
    return response;
  } catch (error) {
    console.log(`Error while creating cloudinary ${error.message}`);
    fs.unlinkSync(localPath);
    return null;
  }
};


export {uploadOnCloudinary};