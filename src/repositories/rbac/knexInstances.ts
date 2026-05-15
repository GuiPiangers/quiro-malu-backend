import { db } from "../../database/knex";
import { KnexRbacRepository } from "./KnexRbacRepository";

export const knexRbacRepository = new KnexRbacRepository(db);
