import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { Photo } from "./Photo";
import { UserPlaceLog } from "./UserPlaceLog";

export interface LatLng {
    latitude: number;
    longitude: number;
}

export enum PlaceType {
    NORMAL = 'normal',
    HIDDEN = 'hidden',
    SPECIAL = 'special'
}

@Entity()
export class Place {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({ type: "geography", spatialFeatureType: "Point", srid: 4326 })
    location!: string;

    @Column()
    points!: number;

    @Column({ type: "float" })
    radius!: number; // Metre cinsinden yarıçap

    @Column({ type: "enum", enum: PlaceType, default: PlaceType.NORMAL })
    placeType!: PlaceType;

    @Column({ type: "float", default: 0 })
    minRequiredPoints!: number; // Yeri görebilmek için gereken minimum puan

    @Column({ type: "float" })
    minZoomLevel!: number;

    @Column({ type: "float" })
    maxZoomLevel!: number;

    @Column({ type: "float" })
    visibilityRadius!: number;

    @Column({ type: "float", default: 50 })
    discoveryRadius!: number; // Gizli yerin keşfedilebilmesi için gereken yakınlık (metre)

    @Column({ default: false })
    requiresProximity!: boolean; // Sadece çok yakınındayken görünür olsun mu?

    @OneToMany(() => Photo, photo => photo.place)
    photos!: Photo[];

    @OneToMany(() => UserPlaceLog, log => log.place)
    visitLogs!: UserPlaceLog[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    calculateVisibility() {
        // Gizli yerler için farklı görünürlük hesaplaması
        if (this.placeType === PlaceType.HIDDEN) {
            this.visibilityRadius = this.discoveryRadius;
            this.minZoomLevel = 18; // Sadece en yakın zoom'da görünsün
            this.maxZoomLevel = 20;
            return;
        }

        // Özel yerler için farklı hesaplama
        if (this.placeType === PlaceType.SPECIAL) {
            const baseZoom = 16;
            const zoomReduction = Math.floor(this.points / 200); // Özel yerler için daha yavaş zoom azalması
            this.minZoomLevel = Math.max(baseZoom - zoomReduction, 12);
            this.maxZoomLevel = baseZoom;
            
            // Özel yerler için daha geniş görünürlük
            const baseRadius = 200;
            this.visibilityRadius = baseRadius + (this.points * 15);
            return;
        }

        // Normal yerler için standart hesaplama
        const baseZoom = 18;
        const zoomReduction = Math.floor(this.points / 100);
        this.minZoomLevel = Math.max(baseZoom - zoomReduction, 10);
        this.maxZoomLevel = baseZoom;

        const baseRadius = 100;
        this.visibilityRadius = baseRadius + (this.points * 10);
    }
} 