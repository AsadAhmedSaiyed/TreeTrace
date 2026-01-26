import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Downloads an image from a temporary URL and uploads it to Cloudinary.
 * @param {string} tempUrl - The temporary GEE URL.
 * @param {string} folder - The folder in Cloudinary (e.g. "tree-trace").
 * @returns {Promise<string>} - The PERMANENT Cloudinary URL.
 */
export const saveToCloudinary = async (tempUrl, folder = "tree-trace") => {
  try {
    if (!tempUrl) return null;

    console.log(`bridge: downloading from GEE...`);

    // 2. Download image from GEE as a raw buffer
    const response = await axios.get(tempUrl, { 
      responseType: 'arraybuffer' // Crucial: Treat as binary data
    });
    
    const buffer = Buffer.from(response.data);

    // 3. Upload to Cloudinary using a Stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: folder,
          resource_type: "image",
          format: "png", // Force PNG format
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(error);
          } else {
            console.log(`bridge: saved to ${result.secure_url}`);
            resolve(result.secure_url); // Return the PERMANENT link
          }
        }
      );

      // Pipe the buffer into the upload stream
      uploadStream.end(buffer);
    });

  } catch (error) {
    console.error(`Failed to bridge image: ${error.message}`);
    // Fallback: If bridge fails, return null or the temp URL (risky)
    return null; 
  }
};