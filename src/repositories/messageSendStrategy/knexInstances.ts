import { db } from "../../database/knex";
import { KnexMessageSendStrategyRepository } from "./KnexMessageSendStrategyRepository";

export const knexMessageSendStrategyRepository =
  new KnexMessageSendStrategyRepository(db);
