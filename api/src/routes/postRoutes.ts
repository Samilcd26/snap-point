import { Router } from "express";
import { uploadPhoto } from "../controllers/PostController/store.action";
import { showPhoto } from "../controllers/PostController/show.action";
import { toggleLike } from "../controllers/PostController/like.action";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Protected routes
router.post("/",  upload.single("photo"), uploadPhoto);
router.get("/:id",  showPhoto);
router.post("/:id/like",  toggleLike);

export default router; 