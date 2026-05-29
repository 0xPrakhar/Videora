// Load environment variables from the .env file
// Example: PORT=8000, DB_URL=mongodb://localhost:27017
import dotenv from "dotenv";
import connectDB from "./Db/index.js"; // Function to connect to MongoDB
import app from "./app.js"; // Express app instance

// Tell dotenv to read the .env file
dotenv.config({ path: "./.env" });

// Connect to MongoDB first
connectDB().then(() => {
    // If database connection is successful, start the server
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);

        // Handle server errors (like port already in use)
        app.on("error", (error) => {
            console.error("Error occurred at server:", error);
        });
    });
}).catch((error) => {
    // If database connection fails, log the error
    console.error("Error connecting to MongoDB:", error);
});
