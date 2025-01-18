import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

let connectionOptions: DataSourceOptions = {
  type: (process.env.DB_TYPE || "postgres") as "postgres",
  host: process.env.DB_HOST || "postgres",
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "snappoint",
  synchronize: false,
  logging: true,
  entities: ["dist/src/entities/*.entity{.ts,.js}"],
  migrations: ["dist/db/migrations/*{.ts,.js}"],
};

export default new DataSource({
  ...connectionOptions,
});