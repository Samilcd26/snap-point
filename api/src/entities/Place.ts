import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Photo } from "./Photo";
import { UserPlaceLog } from "./UserPlaceLog";

@Entity()
export class Place {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column("point")
    location!: string;

    @Column()
    points!: number;

    @Column({ type: "float" })
    radius!: number; // Metre cinsinden yarıçap

    @OneToMany(() => Photo, photo => photo.place)
    photos!: Photo[];

    @OneToMany(() => UserPlaceLog, log => log.place)
    visitLogs!: UserPlaceLog[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 