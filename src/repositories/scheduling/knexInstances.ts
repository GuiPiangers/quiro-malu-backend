import { db } from "../../database/knex";
import { KnexSchedulingRepository } from "./KnexSchedulingRepository";

export const knexSchedulingRepository = new KnexSchedulingRepository(db);
