import { db } from "../../database/knex";
import { KnexExamsRepository } from "./KnexExamsRepository";

export const knexExamsRepository = new KnexExamsRepository(db);
