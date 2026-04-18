# Task 01 — Estratégia `send_most_recent_patients`

**Referência:** `tasks/sendStrategy.spec.md` e `tasks/sendStrategy.md`  
**Objetivo desta tarefa:** entregar a **primeira** estratégia (`send_most_recent_patients`), persistência mínima, vínculo **por campanha** (`campaignId`), e aplicação **somente** nos três `Send*UseCase` (sem alterar filas).

**Fora de escopo (tarefas futuras):** `send_most_frequency_patients`, `send_selected_list`, `exclude_patients_list`; otimização de fila; UI.

---

## 1. Banco de dados

1.1. Migration Knex criando:

- Tabela **`message_send_strategies`**: `id` (string PK), `userId` (string, FK → users, index), `kind` (string), `params` (JSON), `created_at`, `updated_at`.
- Tabela **`user_message_send_strategy`**: PK composta **`(userId, campaignId)`** ou UNIQUE equivalente; `strategyId` FK → `message_send_strategies.id`; timestamps se fizer sentido ao padrão do projeto.

1.2. `kind` na migration: aceitar valor literal `send_most_recent_patients` (outros kinds podem ser adicionados em migrations posteriores ou mesmo arquivo com comentário “extensível”).

1.3. `params` JSON para este kind: `{ "amount": number }` com validação na aplicação (1–50), não obrigar CHECK no MySQL se o projeto evita.

1.4. Rollback da migration alinhado ao guia do repositório.

---

## 2. Constantes e tipos

2.1. **`campaignId`**: string (id da configuração de mensagem no banco — aniversário, pré ou pós conforme o use case de envio). Não usar enum de “tipo de canal” para persistência do vínculo.

2.2. Enum ou union **`SendStrategyKind`**: nesta task, implementar uso concreto apenas de **`send_most_recent_patients`**; demais valores podem existir como literais reservados para evolução ou ficar só no banco como string livre — escolher uma abordagem e documentar no código.

---

## 3. Domínio — Strategy

3.1. Tipo **`SendStrategyContext`**: `{ userId: string; patientId: string }` (sem campos específicos de campanha).

3.2. Interface **`IMessageSendStrategy`**: `allowsSend(ctx): Promise<boolean>` (+ `readonly kind` se útil).

3.3. Classe **`SendMostRecentPatientsStrategy`**:

- Construtor recebe `params` validados (`amount` 1–50) + dependência **`IPatientRepository`** (ou método dedicado).
- `allowsSend`: retorna `true` se `patientId` estiver entre os **N** pacientes mais recentes do `userId`, com **N = amount**; caso contrário `false`.
- Ordenação “mais recente”: conforme spec — **`patients.created_at` DESC** (confirmar coluna real na tabela de pacientes; se o projeto usar outro critério, alinhar ao spec “Pendências / defaults”).

3.4. **Factory / resolver** (ex.: `MessageSendStrategyFactory` ou `MessageSendStrategyResolver`):

- Dado um row `message_send_strategies` (`kind` + `params`), devolver instância de `IMessageSendStrategy`.
- Nesta task, tratar apenas `kind === 'send_most_recent_patients'`; outros kinds → `ApiError` 400/501 ou ignorar conforme decisão explícita no código (preferir erro claro se o banco tiver lixo).

---

## 4. Repositório de estratégias

4.1. `ETableNames` com os dois nomes de tabela.

4.2. Interface **`IMessageSendStrategyRepository`** (nomes alinhados ao projeto) com pelo menos:

- `findActiveStrategyByUserAndCampaign(userId, campaignId)` → retorna `{ id, userId, kind, params }` ou `null` se não houver vínculo.

4.3. Implementação Knex + `ApiError` em falhas, padrão dos outros repositórios.

4.4. Mock Jest para testes dos use cases que dependerem do repositório.

---

## 5. Repositório de pacientes

5.1. Estender **`IPatientRepository`** + `KnexPatientRepository` com método do tipo:

- `listPatientIdsByUserIdOrderByCreatedDesc(userId: string, limit: number): Promise<string[]>`  
  com `limit` já esperado entre 1 e 50 (quem chama aplica clamp se necessário).

5.2. Garantir que só pacientes do `userId` entram no resultado (mesma regra de isolamento do restante do app).

5.3. Testes unitários do repositório **ou** testes da strategy com mock do repo (mínimo exigido pela política de cobertura do projeto).

---

## 6. Persistência de configuração (mínimo para testar ponta a ponta)

Para a estratégia ser “configurável” e salva, implementar o **mínimo** de casos de uso + HTTP (seguir `docs/USECASE_GUIDE.md`, `docs/CONTROLLER_GUIDE.md`, `docs/REPOSITORY_GUIDE.md`):

6.1. **Criar estratégia** (`kind` fixo ou validado como `send_most_recent_patients` + `params.amount`).

6.2. **Associar a campanhas** — use case que recebe `strategyId` + lista `campaignIds[]` e faz **upsert** em `user_message_send_strategy` respeitando PK **`(userId, campaignId)`** (usuário dono = `strategy.userId`).

6.3. **Remover vínculo ou estratégia** (opcional nesta task, mas desejável): delete estratégia em cascata nos vínculos ou endpoint “limpar campanha”.

6.4. Rotas em `src/router.ts` + `authMiddleware`.

6.5. Testes `*.spec.ts` dos use cases criados.

---

## 7. Integração nos envios (único ponto)

Conforme `sendStrategy.spec.md`:

7.1. Injetar o **resolver** (ou factory + repo de estratégias) em:

- `SendBirthdayMessageUseCase` — `campaignId` = `job.campaignId`.
- `SendBeforeScheduleMessageUseCase` — `campaignId` = `job.beforeScheduleMessageId`.
- `SendAfterScheduleMessageUseCase` — `campaignId` = `job.afterScheduleMessageId`.

7.2. Fluxo: após validações já existentes (campanha/config ativa, instância WhatsApp, etc.) e **antes** de `sendMessage` / envio:

1. `findActiveStrategyByUserAndCampaign(job.userId, campaignId)`.
2. Se `null`, seguir fluxo atual.
3. Se existir, montar strategy → `allowsSend({ userId, patientId })`.
4. Se `false`, **return** (no-op; log debug opcional).

7.3. Wiring em `index.ts` dos três sends (instâncias Knex + factory).

7.4. Atualizar / criar specs existentes (`SendBirthdayMessageUseCase.spec.ts`, etc.) cobrindo: sem estratégia (comportamento atual); com estratégia e paciente **dentro** do top N; com estratégia e paciente **fora** do top N.

---

## 8. Critérios de aceite

- [ ] Migration aplicável e rollback ok.
- [ ] `amount` fora de 1–50 rejeitado na criação/atualização da estratégia (`ApiError` 400 com campo quando fizer sentido).
- [ ] Um vínculo ativo por **`(userId, campaignId)`**; upsert substitui o anterior para aquela campanha.
- [ ] Os três sends respeitam a estratégia só no momento do envio; **nenhuma** alteração em `BeforeScheduleQueue`, `AfterScheduleQueue`, `patientsBirthDayQueue` para filtro de estratégia.
- [ ] `npm run test` passa nos módulos tocados.

---

## 9. Ordem sugerida de implementação

1. Migration + `ETableNames`  
2. `IMessageSendStrategyRepository` + Knex + mock  
3. Método em `IPatientRepository` / Knex  
4. `SendMostRecentPatientsStrategy` + factory (apenas este `kind`)  
5. Use cases + controllers + rotas de configuração mínima  
6. Integração nos três `Send*UseCase` + specs  

---

## 10. Nota de encadeamento

Ao concluir a Task 01, as Tasks 02+ podem reutilizar as mesmas tabelas e o factory (novos `kind` + novas classes strategy) sem recriar o modelo de vínculo **`(userId, campaignId)`**.
