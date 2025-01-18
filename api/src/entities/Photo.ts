import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Place } from "./Place";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    imageUrl!: string;

    @Column("point")
    location!: string;

    @Column()
    pointsEarned!: number;

    @ManyToOne(() => User, (user: User) => user.photos)
    user!: User;

    @ManyToOne(() => Place, (place: Place) => place.photos)
    place!: Place;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 