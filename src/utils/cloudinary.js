import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFIlePath) => {
  try {
    if(!localFIlePath) return null;
    //upload the file on clodinary
    const response = await clodinary.uploader.upload(localFIlePath, {
      resource_type: "auto"
    })
    //file has been uploaded successfully
    // console.log("file is uploaded to the cloudinary", response.url);
    fs.unlinkSync(localFIlePath)
    return response;
  }catch (error) {
    fs.unlinkSync(localFIlePath) //remove the locally saved temp file as the upload operation gets failed
  }
}

export {uploadOnCloudinary}