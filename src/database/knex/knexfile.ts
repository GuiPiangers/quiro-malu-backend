import { Knex } from "knex";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", "..", "..", ".env") });

export const development: Knex.Config = {
  client: "mysql2",
  useNullAsDefault: true,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.resolve(__dirname, "..", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "..", "seeds"),
  },
};
export const production: Knex.Config = {
  client: "mysql2",
  useNullAsDefault: true,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.resolve(__dirname, "..", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "..", "seeds"),
  },
};
