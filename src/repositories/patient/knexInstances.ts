import { db } from "../../database/knex";
import { KnexPatientRepository } from "./KnexPatientRepository";

export const knexPatientRepository = new KnexPatientRepository(db);
