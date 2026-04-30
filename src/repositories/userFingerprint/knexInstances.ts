import { db } from "../../database/knex";
import { KnexUserFingerprintRepository } from "./KnexUserFingerprintRepository";

export const knexUserFingerprintRepository =
  new KnexUserFingerprintRepository(db);
