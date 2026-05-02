import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

const UNIQUE_STRATEGY_ID = "unique-user-strategy";
const NEW_TABLE = ETableNames.USER_CAMPAIGN_UNIQUE_SEND_STRATEGY;
const BINDINGS = ETableNames.USER_MESSAGE_SEND_STRATEGY;
const STRATEGIES = ETableNames.MESSAGE_SEND_STRATEGIES;

/**
 * “Único por paciente” deixa de usar linha fantasma em `message_send_strategies`
 * + FK: vínculo próprio em tabela dedicada (só `userId` + `campaignId`).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(NEW_TABLE, (table) => {
    table.string("userId", 100).notNullable();
    table.string("campaignId", 100).notNullable();
    table.timestamps(true, true);
    table.primary(["userId", "campaignId"]);
    table
      .foreign("userId")
      .references("id")
      .inTable(ETableNames.USERS)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.raw(
    `INSERT INTO \`${NEW_TABLE}\` (\`userId\`, \`campaignId\`, \`created_at\`, \`updated_at\`)
     SELECT \`userId\`, \`campaignId\`, \`created_at\`, \`updated_at\`
     FROM \`${BINDINGS}\`
     WHERE \`strategyId\` = ?`,
    [UNIQUE_STRATEGY_ID],
  );

  await knex(BINDINGS).where({ strategyId: UNIQUE_STRATEGY_ID }).del();
  await knex(STRATEGIES).where({ id: UNIQUE_STRATEGY_ID }).del();
}

type UniqueSendBindingRow = {
  userId: string;
  campaignId: string;
  created_at: Date;
  updated_at: Date;
};

export async function down(knex: Knex): Promise<void> {
  const rows: UniqueSendBindingRow[] = await knex(NEW_TABLE).select(
    "userId",
    "campaignId",
    "created_at",
    "updated_at",
  );

  await knex.schema.dropTableIfExists(NEW_TABLE);

  if (rows.length === 0) {
    return;
  }

  const existsStrategy = await knex(STRATEGIES).where({ id: UNIQUE_STRATEGY_ID }).first();
  if (!existsStrategy) {
    const firstUser = await knex(ETableNames.USERS).select("id").limit(1).first();
    if (!firstUser?.id) {
      throw new Error(
        "Rollback exige um usuário em `users` para recriar a linha template `unique-user-strategy`.",
      );
    }
    await knex(STRATEGIES).insert({
      id: UNIQUE_STRATEGY_ID,
      userId: firstUser.id,
      name: "Único por paciente",
      kind: "unique_send_by_patient",
      params: JSON.stringify({}),
    });
  }

  await knex(BINDINGS).insert(
    rows.map((r) => ({
      userId: r.userId,
      campaignId: r.campaignId,
      strategyId: UNIQUE_STRATEGY_ID,
      created_at: r.created_at,
      updated_at: r.updated_at,
    })),
  );
}
