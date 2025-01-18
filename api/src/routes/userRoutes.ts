import { Router } from "express";
import { register, login, getProfile, updateProfile, getLeaderboard, updateLocation, getNearbyPlaces, refreshToken } from "../controllers/userController";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/leaderboard", getLeaderboard);
router.post("/location", updateLocation);
router.get("/nearby-places", getNearbyPlaces);


export default router; 