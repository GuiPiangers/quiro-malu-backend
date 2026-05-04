import type { Knex } from "knex";

class IntegrationTestRollback extends Error {
  constructor() {
    super("INTEGRATION_TEST_ROLLBACK");
    this.name = "IntegrationTestRollback";
  }
}

/**
 * Executa `fn` dentro de uma transação Knex e desfaz tudo ao final (rollback),
 * para que inserts/updates do teste não persistam após o caso.
 */
export async function withRollbackTransaction<T>(
  knex: Knex,
  fn: (trx: Knex.Transaction) => Promise<T>,
): Promise<T> {
  let result!: T;
  try {
    await knex.transaction(async (trx) => {
      result = await fn(trx);
      throw new IntegrationTestRollback();
    });
  } catch (error) {
    if (error instanceof IntegrationTestRollback) {
      return result;
    }
    throw error;
  }
  return result;
}
