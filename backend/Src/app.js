// Bring in the tools we need
import express from 'express';        // Express helps us build web servers
import cors from 'cors';              // CORS lets other websites talk to our server safely
import cookieParser from 'cookie-parser'; // Reads cookies sent by the browser

// Make a new Express app
const app = express();

// Allow cross‑origin requests (from other websites)
app.use(cors({
    origin: process.env.CORS_ORIGIN,   // Only allow requests from this website (set in .env file)
    credentials: true,                 // Allow cookies and login info to be sent
    methods: ["GET", "POST", "PUT", "DELETE"], // Only allow these request types
}));

// Read cookies from incoming requests
app.use(cookieParser());

// Read JSON data from requests (like API calls)
// Limit: only accept up to 10kb of data
app.use(express.json({ limit: "10kb" }));

// Read form data (like login forms)
// extended: true means it can handle nested objects
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Serve static files (images, CSS, JS) from the "Public" folder
// Example: if you ask for /style.css, it looks inside Public/style.css
app.use(express.static("Public"));

//routes
import userRouter from './Routes/user.route.js';
//routes declaration
app.use('/api/v1/users',userRouter);


// Share this app with other files (like server.js)
export default app;
