import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    // Upload the file
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    
    console.log("File is uploaded on cloudinary", response.url);
    
    // **IMPORTANT:** After a successful upload, you should delete the local file.
    // Your original code only deleted it on failure.
    fs.unlinkSync(localFilePath); 
    
    return response;

  } catch (error) {
    // **LOG THE REAL ERROR HERE**
    console.error("CLOUDINARY UPLOAD ERROR:", error.message);

    // Try to delete the file, but don't crash if it fails
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath); 
      }
    } catch (unlinkError) {
      console.error("Error deleting local file after failed upload:", unlinkError.message);
    }
    
    return null;
  }
};

export {uploadOnCloudinary}