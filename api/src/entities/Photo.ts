import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
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

    @Column({ nullable: true })
    caption?: string;

    @ManyToOne(() => User, (user: User) => user.photos)
    user!: User;

    @ManyToOne(() => Place, (place: Place) => place.photos)
    place!: Place;

    @ManyToMany(() => User)
    @JoinTable({ name: "photo_likes" })
    likedBy!: User[];

    @Column({ default: 0 })
    likeCount!: number;

    @Column({ default: 0 })
    commentCount!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 