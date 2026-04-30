import { db } from "../../database/knex";
import { KnexEventSuggestionRepository } from "./KnexEventSuggestionRepository";

export const knexEventSuggestionRepository =
  new KnexEventSuggestionRepository(db);
