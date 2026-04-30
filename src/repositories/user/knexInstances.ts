import { db } from "../../database/knex";
import { KnexUserRepository } from "./KnexUserRepository";

export const knexUserRepository = new KnexUserRepository(db);
