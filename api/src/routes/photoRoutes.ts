import { Router } from "express";
import { uploadPhoto, getVisitedPlaces } from "../controllers/photoController";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Protected routes
router.post("/upload", upload.single("photo"), uploadPhoto);
router.get("/visited-places", getVisitedPlaces);

export default router; 