import knex from "knex";
import { development, production } from "./knex/knexfile";
import * as dotenv from "dotenv";
dotenv.config();

console.log(process.env.MYSQL_USER);
console.log("ola");

const getEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return production;
    default:
      return development;
  }
};

export const Knex = knex(getEnvironment());
