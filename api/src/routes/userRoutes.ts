import { Router } from "express";
import { getProfile, updateProfile, getLeaderboard, updateLocation } from "../controllers/UserController/userController";

const router = Router();


// Protected routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/leaderboard", getLeaderboard);
router.post("/location", updateLocation);


export default router; 