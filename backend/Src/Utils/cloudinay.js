// Import Cloudinary's v2 API and rename it as 'cloudinary'
import { v2 as cloudinary } from 'cloudinary';

// Import Node.js 'fs' module to work with the file system
import fs from 'fs';

// Configure Cloudinary with credentials stored in environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,       // API key for authentication
    api_secret: process.env.CLOUDINARY_API_SECRET  // API secret for authentication
});

// Function to upload a file to Cloudinary
const uploadToCloudinary = async (filePath, folder) => {
    try {
        // Safety check: ensure a file path is provided
        if (!filePath) return console.error("File path is required for uploading to Cloudinary"); 
        
        // Upload the file to Cloudinary
        // 'folder' specifies the folder in your Cloudinary account
        // 'resource_type: auto' lets Cloudinary detect file type (image, video, etc.)
        const response = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: "auto"
        });

        // Log success message with the uploaded file's URL
        //console.log("File uploaded to Cloudinary successfully", response.url);
        // After successful upload, delete the local file to free up space
        fs.unlinkSync(filePath);
        return response;
        // Return the full response object (contains metadata like public_id, secure_url, etc.)
        

    } catch (error) {
        // If upload fails, delete the local file to avoid clutter
        fs.unlinkSync(filePath);

        // Log the error for debugging
        console.error("Error uploading file to Cloudinary:", error);

        // Rethrow the error so calling code can handle it
        throw error;
    }
}

// Export the function so it can be used in other files
export { uploadToCloudinary };
