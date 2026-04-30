import knex from "knex";
import { development, production } from "./knexfile";
import * as dotenv from "dotenv";
dotenv.config();

const getEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return production;
    default:
      return development;
  }
};

/** Instância padrão do Knex (app e wiring de repositórios). */
export const db = knex(getEnvironment());
