import { db } from "../../database/knex";
import { KnexDiagnosticRepository } from "./KnexDiagnosticRepository";

export const knexDiagnosticRepository = new KnexDiagnosticRepository(db);
