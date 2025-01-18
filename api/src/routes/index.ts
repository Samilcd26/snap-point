import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import photoRoutes from "./photoRoutes";
import placeRoutes from "./placeRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/photos", photoRoutes);
router.use("/places", placeRoutes);

export default router;
