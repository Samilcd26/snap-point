import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AppDataSource from "../db/dataSourceLocal";
import indexRoutes from "./routes";
import { authenticate } from "./middlewares/auth";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define routes to skip authentication
const skipAuthRoutes = ["/api/users/login", "/api/users/register"];

// Apply authentication middleware to all routes
app.use((req, res, next) => {
    if (skipAuthRoutes.includes(req.path)) {
        return next(); // Skip authentication for specified routes
    }
    authenticate(req, res, next);
});

// Routes
app.use("/api", indexRoutes);

// Database connection
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log("Error connecting to database:", error);
    });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 