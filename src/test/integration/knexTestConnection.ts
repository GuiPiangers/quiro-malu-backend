import knex, { type Knex } from 'knex'
import { test as testKnexConfig } from '../../database/knex/knexfile'

/**
 * Instância Knex alinhada ao export `test` de `src/database/knex/knexfile.ts`
 * (mesmas variáveis `DB_HOST`, `MYSQL_ROOT_USER`, `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`).
 * Sempre use esta fábrica em testes de integração que falem com MySQL.
 */
export function createKnexForIntegrationTests(): Knex {
  return knex(testKnexConfig)
}
