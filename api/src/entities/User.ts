import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Photo } from "./Photo";
import { UserPlaceLog } from "./UserPlaceLog";

interface Location {
    latitude: number;
    longitude: number;
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ default: 0 })
    points!: number;

    @Column({ nullable: true })
    refreshToken?: string;

    @OneToMany(() => Photo, (photo: Photo) => photo.user)
    photos!: Photo[];

    @OneToMany(() => UserPlaceLog, (log: UserPlaceLog) => log.user)
    placeLogs!: UserPlaceLog[];

    currentLocation?: Location;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 