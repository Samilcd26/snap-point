import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateInitialTables1705430000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable PostGIS extension for geography types
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);

        // Create User table
        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "username",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "varchar",
                    },
                    {
                        name: "points",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "refreshToken",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Create Place table
        await queryRunner.createTable(
            new Table({
                name: "place",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "description",
                        type: "varchar",
                    },
                    {
                        name: "location",
                        type: "point",
                    },
                    {
                        name: "points",
                        type: "int",
                    },
                    {
                        name: "radius",
                        type: "float",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Create Photo table
        await queryRunner.createTable(
            new Table({
                name: "photo",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "imageUrl",
                        type: "varchar",
                    },
                    {
                        name: "location",
                        type: "point",
                    },
                    {
                        name: "pointsEarned",
                        type: "int",
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "placeId",
                        type: "uuid",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Create UserPlaceLog table
        await queryRunner.createTable(
            new Table({
                name: "user_place_log",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "placeId",
                        type: "uuid",
                    },
                    {
                        name: "photoId",
                        type: "uuid",
                    },
                    {
                        name: "earnedPoints",
                        type: "int",
                    },
                    {
                        name: "location",
                        type: "geography",
                        spatialFeatureType: "Point",
                        srid: 4326,
                    },
                    {
                        name: "visitedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Add foreign keys
        await queryRunner.createForeignKey(
            "photo",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "user",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "photo",
            new TableForeignKey({
                columnNames: ["placeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "place",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "user_place_log",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "user",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "user_place_log",
            new TableForeignKey({
                columnNames: ["placeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "place",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "user_place_log",
            new TableForeignKey({
                columnNames: ["photoId"],
                referencedColumnNames: ["id"],
                referencedTableName: "photo",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.dropTable("user_place_log");
        await queryRunner.dropTable("photo");
        await queryRunner.dropTable("place");
        await queryRunner.dropTable("user");
    }
} 