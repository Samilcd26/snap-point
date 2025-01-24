import { Request, Response } from "express";
import AppDataSource from "../../../db/dataSource";
import { Place,LatLng } from "../../entities/Place";
import { User } from "../../entities/User";
import { UserPlaceLog } from "../../entities/UserPlaceLog";



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

        const { coordinates } = req.user.currentLocation;
        const [longitude, latitude] = coordinates;
        const placeRepository = AppDataSource.getRepository(Place);

        const places = await placeRepository
            .createQueryBuilder("place")
            .leftJoinAndSelect("place.visitLogs", "visitLogs")
            .leftJoinAndSelect("visitLogs.user", "user")
            .leftJoinAndSelect("visitLogs.photo", "photo")
            .select([
                "place",
                "ST_AsGeoJSON(place.location)::json as location",
                "visitLogs",
                "user",
                "photo"
            ])
            .where(
                "ST_DWithin(place.location::geography, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, place.radius)",
                { latitude, longitude }
            )
            .getRawAndEntities();

        // Format places with proper location coordinates
        const placesWithVisitors = places.entities.map((place, index) => {
            const rawPlace = places.raw[index];
            const geoJson = rawPlace.location;
            
            // Convert GeoJSON to LatLng format
            const latLng: LatLng = {
                latitude: geoJson.coordinates[1],
                longitude: geoJson.coordinates[0]
            };
            
            const visitors = place.visitLogs.map(log => ({
                id: log.user.id,
                username: log.user.username,
                visitDate: log.visitedAt,
                photo: log.photo ? {
                    id: log.photo.id,
                    imageUrl: log.photo.imageUrl
                } : null,
                earnedPoints: log.earnedPoints
            }));
        
            return {
                ...place,
                location: latLng,
                visitors,
                totalVisitors: visitors.length,
                visitLogs: undefined
            };
        });

        res.json(placesWithVisitors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching nearby places" });
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