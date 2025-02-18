import path from "path";
import { fileURLToPath } from "url";

import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';


import databaseConnection from './db.js';

import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import leaveRequestRoutes from "./routes/leaveRequestRoutes.js";
import changePasswordRequestRoutes from "./routes/changePasswordRequestRoutes.js";
import incorrectAttendanceRequestRoutes from "./routes/incorrectAttendanceRequestRoutes.js";


// Declaration
dotenv.config();
const app = express();


// CORS Policies
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
}
));


// Configuration Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes / APIs
app.get('/api/', (req, res) => res.send("Live!"));

app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/change-password-requests", changePasswordRequestRoutes);
app.use("/api/incorrect-attendance", incorrectAttendanceRequestRoutes);



// Get the directory name (ESM does not support __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React frontend
app.use(express.static(path.join(__dirname, "client", "build")));

// Serve the React frontend for all unknown routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


// Connect to server
app.listen(process.env.PORT, (error) => {
    if (!error) {
        console.log(`Server Running On Port: ${process.env.PORT}`);
    } else {
        console.log("Couldn't Connect To Server!")
        console.error(`Error: ${error}`);
    }
});
databaseConnection();