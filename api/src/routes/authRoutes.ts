import { Router } from "express";
import { register, login,  refreshToken } from "../controllers/UserController/userController";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);



export default router; 