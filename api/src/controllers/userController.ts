import { Request, Response } from "express";
import AppDataSource from "../../db/dataSource";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Place } from "../entities/Place";

interface AuthRequest extends Request {
    user?: User;
}

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        
        // Check if user already exists
        const existingUser = await userRepository.findOne({ 
            where: [{ username }, { email }] 
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = userRepository.create({
            username,
            email,
            password: hashedPassword,
            points: 0
        });

        await userRepository.save(user);

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
};

const generateTokens = (userId: string) => {
    const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || "your-super-secret-jwt-key",
        { expiresIn: "15m" } // Access token 15 dakika geçerli
    );

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET || "your-super-secret-refresh-key",
        { expiresIn: "7d" } // Refresh token 7 gün geçerli
    );

    return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = generateTokens(user.id);

        // Refresh token'ı veritabanına kaydet
        user.refreshToken = refreshToken;
        await userRepository.save(user);

        res.json({ 
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                points: user.points
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken, latitude, longitude } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { refreshToken } });

        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        try {
            // Refresh token'ı doğrula
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "your-super-secret-refresh-key");
        } catch (err) {
            // Refresh token geçersizse kullanıcının refresh token'ını sil
            user.refreshToken = undefined;
            await userRepository.save(user);
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Yeni tokenları oluştur
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

        // Yeni refresh token'ı kaydet
        user.refreshToken = newRefreshToken;

        // Eğer konum bilgisi gönderildiyse güncelle
        if (latitude && longitude) {
            user.currentLocation = { latitude, longitude };
        }

        await userRepository.save(user);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                points: user.points,
                currentLocation: user.currentLocation
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token" });
    }
};

export const updateLocation = async (req: AuthRequest, res: Response) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Location is required" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Kullanıcının konumunu session'da saklayalım
        req.user.currentLocation = { latitude, longitude };

        res.json({ message: "Location updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating location" });
    }
};

export const getNearbyPlaces = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.currentLocation) {
            return res.status(400).json({ message: "Location not set. Please update your location first." });
        }

        const { latitude, longitude } = req.user.currentLocation;
        const placeRepository = AppDataSource.getRepository(Place);

        // Yakındaki yerleri bul
        const nearbyPlaces = await placeRepository
            .createQueryBuilder("place")
            .where(
                "ST_DWithin(place.location::geography, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, place.radius)",
                { latitude, longitude }
            )
            .getMany();

        res.json({ nearbyPlaces });
    } catch (error) {
        res.status(500).json({ message: "Error fetching nearby places" });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const userWithPhotos = await userRepository.findOne({
            where: { id: user.id },
            relations: ["photos"]
        });

        res.json(userWithPhotos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const { username, email } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        user.username = username || user.username;
        user.email = email || user.email;

        await userRepository.save(user);

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
};

export const getLeaderboard = async (_req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find({
            order: { points: "DESC" },
            take: 10
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
}; 