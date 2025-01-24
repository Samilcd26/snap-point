import { Request, Response } from "express";
import AppDataSource from "../../../db/dataSource";
import { Photo } from "../../entities/Photo";
import { User } from "../../entities/User";

interface AuthRequest extends Request {
    user?: User;
}

export const toggleLike = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const photoRepository = AppDataSource.getRepository(Photo);

        const photo = await photoRepository.findOne({
            where: { id },
            relations: ['likedBy']
        });

        if (!photo) {
            return res.status(404).json({ message: "Photo not found" });
        }

        // Kullanıcının daha önce like atıp atmadığını kontrol et
        const userLikeIndex = photo.likedBy.findIndex(user => user.id === req.user!.id);
        
        if (userLikeIndex > -1) {
            // Like'ı kaldır
            photo.likedBy = photo.likedBy.filter(user => user.id !== req.user!.id);
            photo.likeCount--;
        } else {
            // Like ekle
            photo.likedBy.push(req.user!);
            photo.likeCount++;
        }

        await photoRepository.save(photo);

        res.json({
            liked: userLikeIndex === -1,
            likeCount: photo.likeCount
        });

    } catch (error) {
        console.error("Error in toggleLike:", error);
        res.status(500).json({ message: "Error toggling like" });
    }
}; 