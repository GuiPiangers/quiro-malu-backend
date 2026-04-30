import { db } from "../../database/knex";
import { KnexServiceRepository } from "./KnexServiceRepository";

export const knexServiceRepository = new KnexServiceRepository(db);
