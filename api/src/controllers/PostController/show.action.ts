import { Request, Response } from "express";
import AppDataSource from "../../../db/dataSource";
import { Photo } from "../../entities/Photo";
import { User } from "../../entities/User";

interface AuthRequest extends Request {
    user: User;
}

export const showPhoto = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "Photo ID is required" });
        }

        const photoRepository = AppDataSource.getRepository(Photo);

        const photo = await photoRepository.findOne({
            where: { id },
            relations: {
                user: true,
                place: true,
                likedBy: true
            },
            select: {
                id: true,
                imageUrl: true,
                location: true,
                pointsEarned: true,
                caption: true,
                likeCount: true,
                commentCount: true,
                createdAt: true,
                user: {
                    id: true,
                    username: true,
                    points: true
                },
                place: {
                    id: true,
                    name: true,
                    description: true,
                    points: true,
                    location: true
                }
            }
        });

        if (!photo) {
            return res.status(404).json({ message: "Photo not found" });
        }

        // Lokasyon verilerini kullanılabilir formata dönüştür
        const locationData = photo.location.toString()
            .replace('POINT(', '')
            .replace(')', '')
            .split(' ')
            .map(coord => parseFloat(coord));

        const response = {
            id: photo.id,
            imageUrl: photo.imageUrl,
            caption: photo.caption,
            location: {
                longitude: locationData[0],
                latitude: locationData[1]
            },
            pointsEarned: photo.pointsEarned,
            likeCount: photo.likeCount,
            commentCount: photo.commentCount,
            isLiked: req.user ? photo.likedBy.some(user => user.id === req.user.id) : false,
            createdAt: photo.createdAt,
            user: {
                id: photo.user.id,
                username: photo.user.username,
                totalPoints: photo.user.points
            },
            place: {
                id: photo.place.id,
                name: photo.place.name,
                description: photo.place.description,
                points: photo.place.points,
                location: {
                    longitude: parseFloat(photo.place.location.toString().split(' ')[0]),
                    latitude: parseFloat(photo.place.location.toString().split(' ')[1])
                }
            }
        };

        res.status(200).json(response);

    } catch (error) {
        console.error("Error in showPhoto:", error);
        res.status(500).json({ message: "Error retrieving photo details" });
    }
};
