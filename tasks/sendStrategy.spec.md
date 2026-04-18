# Especificação de implementação — `sendStrategy`

Este documento é o passo a passo técnico derivado de `tasks/sendStrategy.md`, alinhado às decisões abaixo.

## Decisões já alinhadas

| Tópico | Decisão |
|--------|---------|
| Persistência | Tabela(s) própria(s) no MySQL; estratégia referencia **`userId`** (dono). |
| Associação | Uma estratégia pode estar ligada a **uma ou mais campanhas** de mensagem: cada campanha é identificada pelo **`campaignId`** (id da configuração concreta no banco). |
| Composição | **Uma estratégia ativa por campanha** (sem pipeline AND/OR): para cada par **`(userId, campaignId)`** existe no máximo uma estratégia aplicável. |

## Modelo de domínio recomendado

### Campanha (`campaignId`)

Identificador estável da **configuração de mensagem** que dispara o envio (não é um tipo genérico “aniversário” / “pré” — é o id da linha da campanha):

- **Aniversário** — `id` da campanha em `birthday_messages` (o job de envio já carrega `campaignId`).
- **Pré-agendamento** — `id` da config em `before_schedule_messages` (`beforeScheduleMessageId` no job).
- **Pós-agendamento** — `id` da config em `after_schedule_messages` (`afterScheduleMessageId` no job).

O mesmo paciente pode ser elegível em campanhas diferentes; a política de envio é resolvida **por campanha**, não por “tipo” de mensagem.

### Tipos de estratégia (`SendStrategyKind`)

- `send_most_recent_patients` — parâmetro `amount` (1–50)
- `send_most_frequency_patients` — parâmetro `amount` (1–50)
- `send_selected_list` — parâmetro `patientIdList: string[]`
- `exclude_patients_list` — parâmetro `patientIdList: string[]`

### Tabelas (Knex)

1. **`message_send_strategies`**
   - `id` (string PK, ex. cuid/uuid)
   - `userId` (FK users, index)
   - `kind` (enum string dos quatro tipos acima)
   - `params` (JSON) — payload específico do `kind`; validar no use case na gravação
   - `created_at` / `updated_at`

2. **`user_message_send_strategy`** (associação estratégia ↔ campanha)
   - PK composta **`(userId, campaignId)`** (ou UNIQUE equivalente)
   - `strategyId` (FK → `message_send_strategies.id`)

**Regra de unicidade (composição “single”) — o que isso significa**

- **`campaignId`** é *qual* configuração de mensagem está sujeita àquela regra (ex.: uma campanha de aniversário específica, ou um lembrete pré-consulta específico).
- Para **cada usuário** e **cada campanha**, só pode haver **uma** estratégia escolhida por vez: não faz sentido dois registros dizendo “para a campanha C do user X use a estratégia A” e “para a campanha C do user X use a estratégia B” ao mesmo tempo.
- No banco: na tabela **`user_message_send_strategy`**, chave primária (ou **UNIQUE**) em **`(userId, campaignId)`** + coluna **`strategyId`** apontando para `message_send_strategies`.

**Exemplo:** usuário `u1` pode ter:

| userId | campaignId   | strategyId   |
|--------|--------------|--------------|
| u1     | bday-msg-1   | S-recentes   |
| u1     | before-msg-2 | S-lista      |
| u1     | after-msg-1  | S-recentes   |

Ou seja: **campanhas diferentes** → regras **podem** ser diferentes. Já **dois** `strategyId` distintos para o **mesmo** `(u1, bday-msg-1)` → inválido; o upsert substitui a linha anterior.

**“Uma estratégia em várias campanhas”:** o **mesmo** `strategyId` pode aparecer em **várias linhas** com `campaignId` diferente. O que é único é o **par** `(userId, campaignId)`, não o `strategyId` global do usuário.

**Duas tabelas (mínimo):**

- `message_send_strategies`: `id`, `userId`, `kind`, `params` (JSON) — *o que* a regra é.
- `user_message_send_strategy`: `userId`, `campaignId`, `strategyId` — *em qual campanha* essa regra está ativa (PK / UNIQUE em `userId` + `campaignId`).

### Validação de `params`

| `kind` | Validação |
|--------|-----------|
| `send_most_recent_patients` | `amount` inteiro 1–50 |
| `send_most_frequency_patients` | `amount` inteiro 1–50 |
| `send_selected_list` | `patientIdList` array; tamanho máximo definir (sugestão: **500** ids por requisição; documentar). Todos os ids devem existir e `patient.userId === strategy.userId`. |
| `exclude_patients_list` | Idem validação de posse e limite |

## Onde aplicar a estratégia no código (decisão: um único ponto)

A estratégia é aplicada **somente no momento do envio**, dentro dos três casos de uso:

- `SendBirthdayMessageUseCase`
- `SendBeforeScheduleMessageUseCase`
- `SendAfterScheduleMessageUseCase`

Fluxo em cada um:

1. Resolver se existe estratégia ativa para **`(job.userId, campaignId)`**, onde `campaignId` é o id da campanha daquele envio (`job.campaignId`, `job.beforeScheduleMessageId`, `job.afterScheduleMessageId`).
2. Se existir, chamar `strategy.allowsSend({ userId, patientId })` — **somente** identificadores universais; nada de `schedulingId` ou outros campos específicos dentro do contrato da strategy.
3. Se `allowsSend` for `false`, **retornar sem enviar** (comportamento explícito; opcionalmente log em nível debug para diagnóstico).
4. Se não houver estratégia configurada para aquela campanha, seguir o fluxo atual (sem filtro adicional).

**Por que não filtrar na etapa de enfileiramento (`BeforeScheduleQueue` / `AfterScheduleQueue` / scan de aniversário)?**

- Se o barramento ocorrer **só ao enfileirar**, ao **alterar** a estratégia no banco ficam inconsistentes: pacientes **nunca enfileirados** sob a regra antiga podem deixar de receber mensagem mesmo quando a nova regra os incluiria; e a política vigente deixa de ser “o que está salvo agora”.
- Aplicar **apenas nos `Send*UseCase`**, imediatamente antes de enviar o WhatsApp, garante que **toda alteração de estratégia** passa a valer no **próximo job** que executar, usando sempre o estado atual persistido.

**Trade-off aceito:** podem existir jobs na fila que, ao rodar, fazem no-op (estratégia barra o envio). Isso é intencional em troca de consistência com a configuração e simplicidade (um único lugar para manter e testar).

**Princípio:** a strategy implementa **apenas um filtro sobre paciente** no escopo do `userId`. O **`campaignId`** só entra na **resolução** de qual registro de estratégia aplicar (qual `params` + `kind`), não no tipo de contexto passado para `allowsSend`.

## Interface Strategy (padrão Strategy)

```ts
// Conceitual — ajustar nomes ao projeto
/** Sempre o mesmo contrato: filtro por usuário + paciente (agnóstico de campanha). */
export type SendStrategyContext = {
  userId: string;
  patientId: string;
};

export interface IMessageSendStrategy {
  readonly kind: SendStrategyKind;
  allowsSend(ctx: SendStrategyContext): Promise<boolean>;
}
```

- **Factory** `createStrategyFromRow(row: MessageSendStrategyRow): IMessageSendStrategy` — instancia a classe concreta e injeta repositórios necessários (ex.: `SendMostFrequencyPatientsStrategy` injeta `ISchedulingRepository` + `IPatientRepository`).

Classes:

- `SendMostRecentPatientsStrategy` — depende de `IPatientRepository` (método novo: listar ids dos N mais recentes por `userId` ou `allowsSend` que consulta posição).
- `SendMostFrequencyPatientsStrategy` — depende de repositório que conte agendamentos por paciente (definir: **só realizados**, **todos exceto cancelados**, janela de tempo — ver seção “Pendências / defaults”).
- `SendSelectedListStrategy` — só JSON + validação de ids (pode não precisar de repo se params carregados).
- `ExcludePatientsListStrategy` — idem.

## Repositório

- `IMessageSendStrategyRepository` + implementação Knex (`ETableNames` novos).
- Métodos sugeridos: `findActiveStrategyByUserAndCampaign(userId, campaignId)`, `saveStrategy`, `upsertUserCampaignBinding`, `listStrategiesByUserId`, `deleteStrategy` (e regra: apagar vínculos em `user_message_send_strategy`).

## Repositório de paciente / agendamento (novos métodos)

- **Mais recentes:** `listPatientIdsByUserIdOrderByCreatedDesc(userId, limit)` (limit já clampado 1–50 na strategy).
- **Mais frequência:** `listPatientIdsByUserIdOrderBySchedulingCountDesc(userId, limit)` — especificar SQL (count em `schedulings` agrupado por `patientId`, filtro `userId`, status — ver pendências).

## Use cases e API (seguir `docs/`)

1. **CRUD estratégia** (criar/atualizar/remover `message_send_strategies` + validação de `params` por `kind`).
2. **Associar campanhas** — use case que recebe `strategyId` + `campaignIds[]` e faz upsert em `user_message_send_strategy` respeitando UNIQUE por **`(userId, campaignId)`** (substitui vínculo anterior da mesma campanha).
3. **Obter estratégia ativa por campanha** — para tela de configuração (opcional conforme produto).

Controllers + `router.ts` + testes `*.spec.ts` nos use cases.

## Integração nos sends (único ponto obrigatório)

1. **`SendBirthdayMessageUseCase`** — `campaignId` = `job.campaignId`; após validações já existentes e **antes** de `sendMessage`, resolver estratégia e `allowsSend`; se bloqueado, retornar.
2. **`SendBeforeScheduleMessageUseCase`** — `campaignId` = `job.beforeScheduleMessageId`; mesmo padrão **antes** do envio.
3. **`SendAfterScheduleMessageUseCase`** — `campaignId` = `job.afterScheduleMessageId`; mesmo padrão **antes** do envio.

Injetar **factory** ou `IMessageSendStrategyResolver` (busca row + monta strategy) para manter construtores dos sends enxutos.

**Filas (`patientsBirthDayQueue`, `BeforeScheduleQueue`, `AfterScheduleQueue`):** **não** aplicar filtro de estratégia ao enfileirar nesta fase do projeto; manter apenas o agendamento de jobs como hoje.

_Otimização futura (opcional, fora do escopo inicial):_ reduzir volume de jobs enfileirando só elegíveis no produtor — exige definir semântica quando a estratégia muda com jobs já na fila (re-enfileirar, TTL, etc.).

## Passo a passo (ordem sugerida)

1. Migration: criar tabelas `message_send_strategies` e `user_message_send_strategy` (ou nomes finais alinhados a `ETableNames`).
2. `ETableNames` + repositório Knex + interface.
3. Enum `SendStrategyKind` + validação de JSON `params` (função pura ou classe por kind).
4. Implementar as 4 classes Strategy + factory.
5. `IPatientRepository` / agendamentos: novos métodos para recentes e frequência + testes de integração ou unitários com mock.
6. `SendBirthdayMessageUseCase`: integrar resolver + `allowsSend` antes do envio + specs.
7. `SendBeforeScheduleMessageUseCase` e `SendAfterScheduleMessageUseCase`: idem + specs (filas **sem** alteração de estratégia).
8. Use cases de configuração (CRUD + bind campanhas) + controllers + rotas.
9. Documentar no `.env.sample` apenas se surgir variável nova (ideal: não).

## Testes

- Por strategy: casos limite `amount` 1, 50, 51 rejeitado.
- Listas: paciente de outro `userId` rejeitado; id inexistente rejeitado.
- `allowsSend` com mock de repo para frequência e recentes.
- Regressão: sends sem estratégia configurada comportam-se como hoje (enviar quando demais regras passarem).

---

## Pendências / defaults sugeridos (podem ser ajustados sem mudar o desenho)

| Ponto | Default sugerido |
|-------|------------------|
| “Mais recentes” | Ordenar por `patients.created_at` DESC (ou `updated_at` se for o padrão do produto). |
| “Mais agendamentos” | Contar agendamentos **não cancelados** (incluir futuros e passados), por `patientId` + `userId`; empate quebrar por `patient.created_at` DESC. |
| Tamanho máximo de `patientIdList` | 500 entradas (configurável por constante). |
| Estratégia ausente para uma campanha | **Não filtrar** (comportamento atual). |

Se quiser alterar algum default, registre na issue/PR e ajuste a validação no use case de criação da estratégia.
