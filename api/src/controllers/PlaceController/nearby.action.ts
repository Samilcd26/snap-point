import { Request, Response } from "express";
import AppDataSource from "../../../db/dataSource";
import { Place, PlaceType } from "../../entities/Place";
import { User } from "../../entities/User";

interface NearbyQuery {
    latitude: number;
    longitude: number;
    zoomLevel: number;
}

interface AuthRequest extends Request<{}, {}, {}, NearbyQuery> {
    user?: User;
}

export const getNearbyPlaces = async (req: AuthRequest, res: Response) => {
    try {
        const { latitude, longitude, zoomLevel } = req.query;

        if (!latitude || !longitude || !zoomLevel) {
            return res.status(400).json({ message: "Latitude, longitude and zoom level are required" });
        }

        const placeRepository = AppDataSource.getRepository(Place);

        // Kullanıcı puanına ve konuma göre görünür yerleri getir
        const places = await placeRepository
            .createQueryBuilder("place")
            .where(`
                ST_DWithin(
                    place.location::geography,
                    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
                    CASE
                        WHEN place.placeType = 'hidden' THEN place.discoveryRadius
                        ELSE place.visibilityRadius
                    END
                )
                AND :zoomLevel >= place.minZoomLevel
                AND :zoomLevel <= place.maxZoomLevel
                AND (
                    place.placeType = 'normal'
                    OR (
                        place.placeType IN ('hidden', 'special')
                        AND :userPoints >= place.minRequiredPoints
                    )
                )
            `)
            .setParameters({
                latitude,
                longitude,
                zoomLevel,
                userPoints: req.user?.points || 0
            })
            .select([
                "place.id",
                "place.name",
                "place.description",
                "place.location",
                "place.points",
                "place.placeType",
                "place.visibilityRadius",
                "place.discoveryRadius",
                "place.minZoomLevel",
                "place.maxZoomLevel",
                "place.requiresProximity",
                "place.minRequiredPoints"
            ])
            .getMany();

        // Lokasyon verilerini kullanılabilir formata dönüştür
        const formattedPlaces = places.map(place => {
            const locationStr = place.location.toString();
            const [lng, lat] = locationStr
                .replace('POINT(', '')
                .replace(')', '')
                .split(' ')
                .map(coord => parseFloat(coord));

            // Gizli yerler için ekstra kontroller
            if (place.placeType === PlaceType.HIDDEN && place.requiresProximity) {
                const distance = calculateDistance(
                    parseFloat(latitude.toString()),
                    parseFloat(longitude.toString()),
                    lat,
                    lng
                );

                // Eğer kullanıcı yeterince yakın değilse, yeri gösterme
                if (distance > place.discoveryRadius) {
                    return null;
                }
            }

            return {
                ...place,
                location: {
                    latitude: lat,
                    longitude: lng
                }
            };
        }).filter(place => place !== null);

        res.json(formattedPlaces);

    } catch (error) {
        console.error("Error in getNearbyPlaces:", error);
        res.status(500).json({ message: "Error retrieving nearby places" });
    }
};

// İki nokta arasındaki mesafeyi metre cinsinden hesapla (Haversine formülü)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Dünya yarıçapı (metre)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
} 