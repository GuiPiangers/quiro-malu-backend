import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

const INDEX_NAME = "idx_patients_dob_month_day";

/**
 * Índice funcional (MySQL 8.0.13+): acelera filtros por mês/dia de `dateOfBirth`
 * sem varrer a tabela inteira, alinhado a `MONTH(dateOfBirth)` e `DAY(dateOfBirth)`.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE ?? ADD INDEX ?? ((MONTH(??)), (DAY(??)))`,
    [
      ETableNames.PATIENTS,
      INDEX_NAME,
      "dateOfBirth",
      "dateOfBirth",
    ],
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE ?? DROP INDEX ??`, [
    ETableNames.PATIENTS,
    INDEX_NAME,
  ]);
}
