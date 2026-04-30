import { db } from "../../database/knex";
import { KnexWhatsAppInstanceRepository } from "./KnexWhatsAppInstanceRepository";
import { KnexWhatsAppMessageLogRepository } from "./KnexWhatsAppMessageLogRepository";

export const knexWhatsAppInstanceRepository =
  new KnexWhatsAppInstanceRepository(db);
export const knexWhatsAppMessageLogRepository =
  new KnexWhatsAppMessageLogRepository(db);
