import { Router } from "express";
import { getProfile, updateProfile, getLeaderboard, updateLocation, getNearbyPlaces } from "../controllers/userController";

const router = Router();


// Protected routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/leaderboard", getLeaderboard);
router.post("/location", updateLocation);
router.get("/nearby-places", getNearbyPlaces);


export default router; 