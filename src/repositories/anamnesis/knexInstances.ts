import { db } from "../../database/knex";
import { KnexAnamnesisRepository } from "./KnexAnamnesisRepository";

export const knexAnamnesisRepository = new KnexAnamnesisRepository(db);
