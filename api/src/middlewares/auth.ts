import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import AppDataSource from "../../db/dataSource";

interface AuthRequest extends Request {
    user?: User;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No authorization header" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { id: string };
        const user = await AppDataSource.getRepository(User).findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}; 