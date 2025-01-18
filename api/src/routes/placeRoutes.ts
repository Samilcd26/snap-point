import { Router } from "express";
import { getPlaceDetails, getNearbyPlaces } from "../controllers/placeController";

const router = Router();

// Protected routes
router.get("/nearby", getNearbyPlaces);
router.get("/:id", getPlaceDetails);

export default router; 