import { Request, Response } from "express";
import AppDataSource from "../../db/dataSource";
import { Photo } from "../entities/Photo";
import { User } from "../entities/User";
import { Place } from "../entities/Place";
import { UserPlaceLog } from "../entities/UserPlaceLog";

interface AuthRequest extends Request {
    user?: User;
    file?: Express.Multer.File;
}

export const uploadPhoto = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.file) {
            return res.status(400).json({ message: "Missing user or file" });
        }

        const { latitude, longitude, placeId } = req.body;
        if (!latitude || !longitude || !placeId) {
            return res.status(400).json({ message: "Location and place ID are required" });
        }

        const photoRepository = AppDataSource.getRepository(Photo);
        const placeRepository = AppDataSource.getRepository(Place);
        const userRepository = AppDataSource.getRepository(User);
        const logRepository = AppDataSource.getRepository(UserPlaceLog);

        // Yeri bul
        const place = await placeRepository.findOne({ where: { id: placeId } });
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        // Kullanıcının bu yerde daha önce fotoğraf çekip çekmediğini kontrol et
        const existingLog = await logRepository.findOne({
            where: {
                user: { id: req.user.id },
                place: { id: placeId }
            }
        });

        if (existingLog) {
            return res.status(400).json({ message: "You have already visited this place" });
        }

        // Fotoğrafı kaydet
        const photo = photoRepository.create({
            imageUrl: `/uploads/${req.file.filename}`,
            location: `POINT(${longitude} ${latitude})`,
            pointsEarned: place.points,
            user: req.user
        });
        await photoRepository.save(photo);

        // Log kaydı oluştur
        const log = logRepository.create({
            user: req.user,
            place: place,
            photo: photo,
            earnedPoints: place.points,
            location: `POINT(${longitude} ${latitude})`
        });
        await logRepository.save(log);

        // Kullanıcının puanını güncelle
        req.user.points += place.points;
        await userRepository.save(req.user);

        res.status(201).json({ 
            message: "Photo uploaded successfully", 
            photo,
            earnedPoints: place.points,
            totalPoints: req.user.points
        });
    } catch (error) {
        res.status(500).json({ message: "Error uploading photo" });
    }
};

// Kullanıcının ziyaret ettiği yerleri getir
export const getVisitedPlaces = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        const logRepository = AppDataSource.getRepository(UserPlaceLog);
        const logs = await logRepository.find({
            where: { user: { id: req.user.id } },
            relations: ["place", "photo"],
            order: { visitedAt: "DESC" }
        });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching visited places" });
    }
}; 