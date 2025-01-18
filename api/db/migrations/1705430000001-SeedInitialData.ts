import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class SeedInitialData1705430000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create sample users
        const hashedPassword = await bcrypt.hash("password123", 10);
        
        await queryRunner.query(`
            INSERT INTO "user" (id, username, email, password, points) VALUES
            ('550e8400-e29b-41d4-a716-446655440000', 'john_doe', 'john@example.com', $1, 100),
            ('550e8400-e29b-41d4-a716-446655440001', 'jane_smith', 'jane@example.com', $1, 150),
            ('550e8400-e29b-41d4-a716-446655440002', 'mike_wilson', 'mike@example.com', $1, 75)
        `, [hashedPassword]);

        // Create sample places
        await queryRunner.query(`
            INSERT INTO "place" (id, name, description, location, points, radius) VALUES
            ('660e8400-e29b-41d4-a716-446655440000', 'Galata Kulesi', 'İstanbulun tarihi kulesi', ST_SetSRID(ST_MakePoint(28.974158, 41.025648), 4326), 50, 100),
            ('660e8400-e29b-41d4-a716-446655440001', 'Kız Kulesi', 'Üsküdardaki tarihi kule', ST_SetSRID(ST_MakePoint(29.004129, 41.021177), 4326), 40, 80),
            ('660e8400-e29b-41d4-a716-446655440002', 'Ayasofya', 'Tarihi camii', ST_SetSRID(ST_MakePoint(28.980175, 41.008583), 4326), 60, 120)
        `);

        // Create sample photos
        await queryRunner.query(`
            INSERT INTO "photo" (id, "imageUrl", location, "pointsEarned", "userId", "placeId") VALUES
            ('770e8400-e29b-41d4-a716-446655440000', 'https://example.com/photos/galata1.jpg', ST_SetSRID(ST_MakePoint(28.974158, 41.025648), 4326), 50, '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000'),
            ('770e8400-e29b-41d4-a716-446655440001', 'https://example.com/photos/kizkulesi1.jpg', ST_SetSRID(ST_MakePoint(29.004129, 41.021177), 4326), 40, '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'),
            ('770e8400-e29b-41d4-a716-446655440002', 'https://example.com/photos/ayasofya1.jpg', ST_SetSRID(ST_MakePoint(28.980175, 41.008583), 4326), 60, '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002')
        `);

        // Create sample user place logs
        await queryRunner.query(`
            INSERT INTO "user_place_log" (id, "userId", "placeId", "photoId", "earnedPoints", location) VALUES
            ('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 50, ST_SetSRID(ST_MakePoint(28.974158, 41.025648), 4326)),
            ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 40, ST_SetSRID(ST_MakePoint(29.004129, 41.021177), 4326)),
            ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 60, ST_SetSRID(ST_MakePoint(28.980175, 41.008583), 4326))
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove all seeded data in reverse order
        await queryRunner.query(`DELETE FROM "user_place_log"`);
        await queryRunner.query(`DELETE FROM "photo"`);
        await queryRunner.query(`DELETE FROM "place"`);
        await queryRunner.query(`DELETE FROM "user"`);
    }
} 