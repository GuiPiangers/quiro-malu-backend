# Tasks — Implementar `sendAfterScheduleMessage`

## Contexto
Existe hoje um módulo completo de envio **antes** do agendamento (before schedule) com configs + fila + envio + logs:

- Configs (CRUD): `src/core/messages/useCases/beforeScheduleMessage/*` + `src/core/messages/controllers/*BeforeSchedule*`
- Observer/agenda jobs: `src/core/messages/observers/beforeScheduleMessage/beforeScheduleMessageEventHandlers.ts`
- Fila: `src/queues/beforeScheduleMessage/*`
- Entidade/template: `src/core/messages/models/BeforeScheduleMessage.ts` + `src/core/messages/models/MessageTemplate.ts`
- Logs de envio (WhatsApp): `src/repositories/whatsapp/*WhatsAppMessageLog*` + rotas `src/router.ts`

Nova demanda: criar o equivalente **após** o agendamento (**after schedule**), reutilizando o que fizer sentido, mas com regras diferentes:

- Só enviar quando `scheduling?.status === "Atendido"`.
- Calcular o envio **após** o horário do agendamento (ex.: `scheduledAt + minutesAfterSchedule`).

## Objetivo do módulo after
Entregar um novo módulo com a **mesma ergonomia** do before (models/useCases/controllers/queue/observer), mantendo a possibilidade de evoluir regras do after sem afetar o before.

---

## Diferenças de regra (before vs after)

### `send` (use case de envio)
Before hoje bloqueia envio quando status é `"Cancelado"` **ou** `"Atendido"` (ver: `src/core/messages/useCases/beforeScheduleMessage/sendBeforeScheduleMessage/sendBeforeScheduleMessageUseCase.ts`).

After deve fazer o oposto:
- **Enviar somente se** `status === "Atendido"`.
- Se `status` for `"Agendado"`, `"Atrasado"` ou `"Cancelado"` → **return**.

### Agendamento de job (observer)
Before agenda jobs quando recebe eventos `createSchedule`/`updateSchedule`, calculando `target = scheduleDate - minutesBeforeSchedule` e **remove** o job se `delay <= 0` (ver: `beforeScheduleMessageEventHandlers.ts#calculateDelay`).

After deve:
- Só enfileirar quando o evento possuir `status === "Atendido"`.
- Calcular `target = scheduleDate + minutesAfterSchedule`.
- Se `delay <= 0`, em geral faz sentido **enfileirar com delay 0** (envio imediato), pois ao marcar como atendido o horário geralmente já passou.
  - Se quiser limitar (ex.: não enviar depois de X horas), definir regra explícita.

---

## Passo a passo (implementação)

### 1) Criar a estrutura de domínio do after (model + DTO)
Criar um model equivalente ao before:

- `src/core/messages/models/AfterScheduleMessage.ts`

Espelhar a entidade `BeforeScheduleMessage`:
- trocar `minutesBeforeSchedule` → `minutesAfterSchedule`
- manter `name`, `isActive`, `messageTemplate`
- manter `render(...)` e as mesmas variáveis (se o template for igual)

Checklist:
- Validações iguais às do before (string/boolean/int > 0), só trocando o nome do campo.
- `getDTO()` devolve `minutesAfterSchedule`.

### 2) Criar tabela + enum de tabela
O before usa Knex e tabela `before_schedule_messages` (ver migrations + `ETableNames`).

Criar:
- Novo enum em `src/database/ETableNames.ts`: `AFTER_SCHEDULE_MESSAGES = "after_schedule_messages"`
- Migration de criação (espelhando `20260324120000_create_before_schedule_messages.ts`):
  - incluir `name` já na criação (o before teve migration posterior pra isso)
  - colunas sugeridas:
    - `id` (string 100) PK
    - `userId` (FK users)
    - `name` (string 255)
    - `minutesAfterSchedule` (int unsigned)
    - `textTemplate` (text)
    - `isActive` (boolean)
    - timestamps

### 3) Repositório do after (interface + implementação + mock)
Espelhar os arquivos do before:

- `src/repositories/messages/IAfterScheduleMessageRepository.ts`
- `src/repositories/messages/AfterScheduleMessageRepository.ts`
- `src/repositories/_mocks/AfterScheduleMessageRepositoryMock.ts`

Contrato deve espelhar `IBeforeScheduleMessageRepository`, trocando o campo:
- `minutesBeforeSchedule` → `minutesAfterSchedule`

### 4) Use cases do after (CRUD + watch + send)
Copiar/espelhar a estrutura de `src/core/messages/useCases/beforeScheduleMessage/*`.

Sugestão de estrutura:
- `src/core/messages/useCases/afterScheduleMessage/createAfterScheduleMessage/*`
- `src/core/messages/useCases/afterScheduleMessage/updateAfterScheduleMessage/*`
- `src/core/messages/useCases/afterScheduleMessage/deleteAfterScheduleMessage/*`
- `src/core/messages/useCases/afterScheduleMessage/getAfterScheduleMessage/*`
- `src/core/messages/useCases/afterScheduleMessage/listAfterScheduleMessages/*`
- `src/core/messages/useCases/afterScheduleMessage/watchAfterScheduleMessages/*`
- `src/core/messages/useCases/afterScheduleMessage/sendAfterScheduleMessage/*`

Regras específicas:
- `create/update`: emitir eventos `afterScheduleMessageCreate`/`afterScheduleMessageUpdate`/`afterScheduleMessageDelete` (mesmo padrão do before).
- `watchAfterScheduleMessages`: listar todas as configs e emitir `afterScheduleMessageCreate` para popular o cache de configs do observer (mesmo padrão do before em `WatchBeforeScheduleMessagesUseCase`).
- `sendAfterScheduleMessage`: igual ao before, mas com a regra de status:
  - buscar config; se `!config?.isActive` → return
  - validar WhatsApp conectado (mesmo padrão)
  - buscar patient; se sem phone → return
  - buscar scheduling; **se `scheduling?.status !== "Atendido"` → return**
  - render template via `AfterScheduleMessage.render({ patient, scheduling })`
  - enviar; salvar log

### 5) Observer/event handlers do after (enfileirar jobs)
Criar:

- `src/core/messages/observers/afterScheduleMessage/afterScheduleMessageEventHandlers.ts`
- `src/core/messages/observers/afterScheduleMessage/index.ts`
- testes equivalentes em `src/core/messages/observers/afterScheduleMessage/tests/*`

Espelhar `BeforeScheduleMessageEventHandlers`:
- manter `configsById` e `isRegistered`
- registrar listeners:
  - `afterScheduleMessageCreate`/`Update`/`Delete`
  - `createSchedule`/`updateSchedule`/`deleteSchedule`

Mudanças do after:
- No `handleCreateOrUpdateSchedule(...)`, antes de enfileirar:
  - se `data.status !== "Atendido"` → **não enfileirar**
- Cálculo do delay:
  - before: `target = schedule.minus({ minutes: minutesBefore })`
  - after: `target = schedule.plus({ minutes: minutesAfter })`
  - `delay = max(0, target - now)`

Observação importante:
- O payload dos eventos `createSchedule` e `updateSchedule` inclui `status`, `date`, `patientId` etc (ver: `src/core/scheduling/useCases/createScheduling/CreateSchedulingUseCase.ts` e `UpdateSchedulingUseCase.ts`).

### 6) Fila do after (BullMQ)
Criar o equivalente a `src/queues/beforeScheduleMessage/*`:

- `src/queues/afterScheduleMessage/AfterScheduleQueue.ts`
- `src/queues/afterScheduleMessage/index.ts`

Padrão igual ao before:
- provider: `new QueueProvider<SendAfterScheduleMessageJob>("afterScheduleMessage")`
- `upsert(jobId, payload, delay)` remove+add
- `process()` chama `sendAfterScheduleMessageUseCase.execute(job)`

### 7) Controllers + rotas HTTP
Criar controllers equivalentes aos do before:

- `src/core/messages/controllers/createAfterScheduleMessageController/*`
- `src/core/messages/controllers/listAfterScheduleMessagesController/*`
- `src/core/messages/controllers/getAfterScheduleMessageController/*`
- `src/core/messages/controllers/updateAfterScheduleMessageController/*`
- `src/core/messages/controllers/deleteAfterScheduleMessageController/*`

Adicionar rotas em `src/router.ts` espelhando:
- `POST /afterScheduleMessages`
- `GET /afterScheduleMessages`
- `GET /afterScheduleMessages/:id`
- `PATCH /afterScheduleMessages/:id`
- `DELETE /afterScheduleMessages/:id`

Manter controllers finos (mesmo padrão de `responseError`).

### 8) Inicialização no `start()`
Espelhar o before em `src/start/index.ts`:

- `afterScheduleMessageEventHandlers.register();`
- `await watchAfterScheduleMessagesUseCase.execute();`
- `await afterScheduleQueue.process();`

---

## Logs de WhatsApp: ponto de atenção (precisa decisão)
Hoje os logs estão acoplados ao before:
- Interface exige `beforeScheduleMessageId` (ver: `src/repositories/whatsapp/IWhatsAppMessageLogRepository.ts`).
- Migration cria coluna `beforeScheduleMessageId` NOT NULL (ver: `src/database/migrations/20260410120000_create_whatsapp_message_logs.ts`).

### generalizar logs para suportar before/after
Refatorar a estrutura de logs para representar “mensagens de agendamento” genéricas.

Sugestão:
- Criar colunas novas:
  - `messageType` (ex.: `"beforeSchedule" | "afterSchedule"`) **ou** `scheduleMessageType`
  - `messageConfigId` (id da config)
- Tornar `beforeScheduleMessageId` opcional ou migrar dados:
  - migrar `beforeScheduleMessageId` → `messageConfigId` e setar `messageType = "beforeSchedule"`
- Atualizar:
  - `IWhatsAppMessageLogRepository` e `KnexWhatsAppMessageLogRepository`
  - use cases `ListWhatsAppMessageLogsUseCase` e `GetWhatsAppMessageLogsSummaryUseCase` para filtrar por `messageType/messageConfigId`
  - `sendBeforeScheduleMessageUseCase` e `sendAfterScheduleMessageUseCase` para salvar logs no novo formato

Vantagens:
- Reuso real de listagem/summary de logs.
- Evita duplicar endpoints e tabelas.

Riscos:
- Refatoração + migration com dados existentes.

---

## Refatoração recomendada (compartilhar sem acoplar)

### Extrair para compartilhamento (alto valor / baixo risco)
1. Builder de jobId
   - Hoje: `src/core/messages/utils/buildBeforeScheduleMessageJobId.ts`
   - Sugestão: criar `buildScheduleMessageJobId({ type, userId, scheduleId, configId })` e manter wrappers `buildBefore...`/`buildAfter...`.

2. Cálculo de delay
   - Extrair helper `calculateScheduleMessageDelay({ scheduleDate, minutesOffset, direction })`.
   - `direction: "before" | "after"`.

3. Lógica de envio WhatsApp comum
   - O `sendBeforeScheduleMessageUseCase` contém:
     - validar instância e conexão
     - normalizar telefone
     - enviar
     - persistir log
   - Sugestão: extrair um serviço/helper (ex.: `sendWhatsAppRenderedTemplate(...)`) para reduzir duplicação.

### Manter separado (para evoluir sem interferência)
- Entidades/configs (`BeforeScheduleMessage` vs `AfterScheduleMessage`).
- Repositórios/tabelas de configs (`before_schedule_messages` vs `after_schedule_messages`).
- Eventos (nomes distintos) e queues (keys distintas) para monitoramento e escala.
- Regras de disparo (before independe de status; after depende do status `Atendido`).

---

## Checklist de testes (mínimo)

### Observer (afterScheduleMessageEventHandlers)
- Não agenda job se config inativa.
- Não agenda job se `status !== "Atendido"`.
- Agenda job quando `status === "Atendido"` e calcula delay com `+ minutesAfterSchedule`.
- Em `deleteSchedule`, remove jobs.

### Send use case (sendAfterScheduleMessageUseCase)
- Não envia quando status != `Atendido`.
- Envia quando status == `Atendido` e WhatsApp está `open`.
- Persiste log `PENDING` em sucesso e `FAILED` em falha (ajustar conforme decisão de logs).

---

## Referências diretas no código (para copiar/espelhar)
- Envio before: `src/core/messages/useCases/beforeScheduleMessage/sendBeforeScheduleMessage/sendBeforeScheduleMessageUseCase.ts`
- Observer before: `src/core/messages/observers/beforeScheduleMessage/beforeScheduleMessageEventHandlers.ts`
- Fila before: `src/queues/beforeScheduleMessage/BeforeScheduleQueue.ts`
- Montagem fila before: `src/queues/beforeScheduleMessage/index.ts`
- Inicialização: `src/start/index.ts`
- Rotas before: `src/router.ts`
- Repo configs before: `src/repositories/messages/BeforeScheduleMessageRepository.ts`
- Migration configs before: `src/database/migrations/20260324120000_create_before_schedule_messages.ts`
- Logs WhatsApp (schema/repo): `src/database/migrations/20260410120000_create_whatsapp_message_logs.ts` e `src/repositories/whatsapp/KnexWhatsAppMessageLogRepository.ts`
