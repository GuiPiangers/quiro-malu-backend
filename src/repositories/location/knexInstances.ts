import { db } from "../../database/knex";
import { KnexLocationRepository } from "./KnexLocationRepository";

export const knexLocationRepository = new KnexLocationRepository(db);
