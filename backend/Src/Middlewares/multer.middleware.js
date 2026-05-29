import multer from "multer";  
// Importing the multer library, which is used for handling file uploads in Node.js
import path from "path";
const uploadPath = path.join(process.cwd(), "Public/Temp");
const storage = multer.diskStorage({
    // Configure storage engine to save files on disk

    destination: function (req, file, cb) {
        // 'destination' defines the folder where uploaded files will be stored
        // 'cb' is a callback function: first argument is error (null if no error), second is the path
        cb(null, uploadPath);
        // Files will be saved inside the "Public/Temp" directory
    },

    filename: function (req, file, cb) {
        // 'filename' defines how the uploaded file will be named
        // 'file.originalname' is the original name of the file from the client
        // 'Date.now()' ensures uniqueness by prefixing the current timestamp
        cb(null, Date.now() + "-" + file.originalname);
        // Example: "1714650000000-myphoto.png"
    }
});


// Create an upload middleware using the defined storage settings
// This 'upload' can now be used in routes to handle file uploads
export const upload = multer({ storage: storage });