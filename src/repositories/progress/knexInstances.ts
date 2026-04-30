import { db } from "../../database/knex";
import { KnexProgressRepository } from "./KnexProgressRepository";

export const knexProgressRepository = new KnexProgressRepository(db);
