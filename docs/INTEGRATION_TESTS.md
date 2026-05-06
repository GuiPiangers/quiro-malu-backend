# Testes de integração

## Nomenclatura e execução

| Tipo        | Padrão de arquivo   | Comando                          |
|------------|---------------------|----------------------------------|
| Unitário   | `**/*.spec.ts`      | `npm run test:unit`              |
| Integração | `**/*.int.spec.ts` | `npm run test:integration` (`vitest.integration.config.ts`) |
| Todos      | ambos               | `npm run test`                   |

Por padrão, `npm run test` **não** executa casos `*.int.spec.ts` (eles ficam `skipped`), para não depender de MySQL acessível no mesmo host do `.env`. Para rodar integração: use `npm run test:integration` (define `RUN_INTEGRATION_TESTS=true`) ou exporte `RUN_INTEGRATION_TESTS=true` manualmente.

Arquivos `*.int.spec.ts` ficam próximos ao código que exercitam (mesma pasta dos use cases, por exemplo), mas o sufixo deixa claro que dependem de infraestrutura (banco, fila, etc.).

## Conexão MySQL (Knex)

Testes de integração que acessam o banco devem usar a configuração **`test`** exportada em `src/database/knex/knexfile.ts` (variáveis `DB_HOST`, `MYSQL_ROOT_USER`, `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`).

```ts
import { createKnexForIntegrationTests } from "../../test/integration/knexTestConnection";
```

Não reutilize `src/database/knex/index.ts` (`db`), que segue `NODE_ENV` e o export `development` / `production` do knexfile.

Recomenda-se apontar `MYSQL_DATABASE` para um banco dedicado a testes (migrations aplicadas), para não misturar com dados locais de desenvolvimento.

## Transação com rollback

Cada caso de integração que escreve no banco deve rodar dentro de uma transação revertida ao final, para isolamento entre testes.

```ts
import { withRollbackTransaction } from "../../test/integration/transactionRollback";

await withRollbackTransaction(knex, async (trx) => {
  const repo = new KnexSchedulingRepository(trx);
  // ... asserts usando o mesmo trx para ler o que foi gravado
});
```

Padrão: usar `withRollbackTransaction` (ou equivalente) em **todos** os futuros testes de integração que mutam dados.

## Pré-requisitos

1. Variáveis `DB_HOST`, `MYSQL_ROOT_USER` e `MYSQL_DATABASE` (e senha, se aplicável), alinhadas ao export `test` do knexfile.  
2. `RUN_INTEGRATION_TESTS=true` (o script `npm run test:integration` já define isso).

Sem (1) ou (2), a suíte de integração fica `skipped` e `npm run test` permanece verde sem MySQL.

## Eventos (`AppEventListener`)

O `appEventListener` exportado é o **singleton da aplicação**. **Não** chame `clearAllListeners()` nele em testes que possam rodar no mesmo processo que a API (remove listeners registrados no bootstrap).

Para testar `emit` / `on`, injete uma instância isolada: os use cases de agendamento aceitam `IAppEventListener` (default = singleton). Nos `*.int.spec.ts`, use `new AppEventListener()` e passe ao construtor do use case; registre `on` e `spyOn` só nessa instância.
