import { Request, Response } from "express";
import AppDataSource from "../../db/dataSource";
import { Place } from "../entities/Place";
import { User } from "../entities/User";

interface AuthRequest extends Request {
    user?: User;
}

export const getPlaceDetails = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const placeRepository = AppDataSource.getRepository(Place);

        const place = await placeRepository.findOne({
            where: { id },
            relations: [
                "photos",
                "photos.user",
                "visitLogs",
                "visitLogs.user",
                "visitLogs.photo"
            ]
        });

        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        // Ziyaretçi bilgilerini düzenle
        const visitors = place.visitLogs.map(log => ({
            id: log.user.id,
            username: log.user.username,
            visitDate: log.visitedAt,
            photo: {
                id: log.photo.id,
                imageUrl: log.photo.imageUrl
            },
            earnedPoints: log.earnedPoints
        }));

        res.json({
            ...place,
            visitors,
            totalVisitors: visitors.length,
            // Hassas bilgileri kaldır
            visitLogs: undefined
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching place details" });
    }
};

export const getNearbyPlaces = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.currentLocation) {
            return res.status(400).json({ message: "Location not set. Please update your location first." });
        }

        const { latitude, longitude } = req.user.currentLocation;
        const placeRepository = AppDataSource.getRepository(Place);

        const places = await placeRepository
            .createQueryBuilder("place")
            .leftJoinAndSelect("place.visitLogs", "visitLogs")
            .leftJoinAndSelect("visitLogs.user", "user")
            .leftJoinAndSelect("visitLogs.photo", "photo")
            .where(
                "ST_DWithin(place.location::geography, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, place.radius)",
                { latitude, longitude }
            )
            .getMany();

        // Her yer için ziyaretçi bilgilerini düzenle
        const placesWithVisitors = places.map(place => {
            const visitors = place.visitLogs.map(log => ({
                id: log.user.id,
                username: log.user.username,
                visitDate: log.visitedAt,
                photo: {
                    id: log.photo.id,
                    imageUrl: log.photo.imageUrl
                },
                earnedPoints: log.earnedPoints
            }));

            return {
                ...place,
                visitors,
                totalVisitors: visitors.length,
                // Hassas bilgileri kaldır
                visitLogs: undefined
            };
        });

        res.json(placesWithVisitors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching nearby places" });
    }
}; 