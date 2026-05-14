import { db } from "../../database/knex";
import { KnexClinicRepository } from "./KnexClinicRepository";

export const knexClinicRepository = new KnexClinicRepository(db);
