import { db } from "../../database/knex";
import { KnexFinanceRepository } from "./knexFinanceRepository";

export const knexFinanceRepository = new KnexFinanceRepository(db);
