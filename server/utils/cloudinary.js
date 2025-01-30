import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadMedia = async (filePath) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(filePath, {
           resource_type: "auto",
        });
        return uploadResponse;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to upload media");
    }
}

export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        
    } catch (error) {
        console.error(error);
    }
}

export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId,{resource_type: "video"});
      
    } catch (error) {
        console.error(error);
    }
}
