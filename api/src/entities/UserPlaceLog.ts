import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Place } from "./Place";
import { Photo } from "./Photo";

@Entity()
export class UserPlaceLog {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, user => user.placeLogs)
    user!: User;

    @ManyToOne(() => Place)
    place!: Place;

    @ManyToOne(() => Photo)
    photo!: Photo;

    @Column()
    earnedPoints!: number;

    @Column({ type: "geography", spatialFeatureType: "Point", srid: 4326 })
    location!: string;

    @CreateDateColumn()
    visitedAt!: Date;
} 