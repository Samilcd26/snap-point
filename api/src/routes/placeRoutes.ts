import { Router } from "express";
import { getPlaceDetails, getNearbyPlaces, getVisitedPlaces } from "../controllers/PlaceController/placeController";

const router = Router();

// Protected routes
router.get("/nearby", getNearbyPlaces);
router.get("/detail/:id", getPlaceDetails);
router.get("/visited-places", getVisitedPlaces);

export default router; 