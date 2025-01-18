import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

let connectionOptions: DataSourceOptions = {
  type: "postgres" as "postgres", // It could be mysql, mongo, etc
  host: "postgres",
  port: 5432,
  username: "postgres", // postgre username
  password: "postgres", // postgre password
  database: "snappoint", // postgre db, needs to be created before
  synchronize: false, // if true, you don't really need migrations
  logging: true,
  entities: ["src/entities/*.ts"], // where our entities reside
  migrations: ["db/migrations/*.ts"], // where our migrations reside
  migrationsRun: true // automatically run migrations on startup
};

export default new DataSource({
  ...connectionOptions,
});