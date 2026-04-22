# Task 02 — Estratégia `send_most_frequency_patients`

**Referência:** `tasks/sendStrategy.spec.md` (tabela de kinds, validação de `params`, defaults em “Pendências / defaults”) e **exemplo de implementação** `src/core/messages/models/SendMostRecentPatientsMessageSendStrategy.ts` + fluxo já existente para `send_most_recent_patients` (create/update use case, factory, `SendMostRecentPatientsStrategy`, repositório Knex).

**Objetivo desta tarefa:** permitir criar, atualizar, persistir e aplicar em runtime a estratégia **`send_most_frequency_patients`** com parâmetro **`amount` (1–50)**, espelhando o desenho de “mais recentes”, mas com semântica de **mais agendamentos** no `allowsSend`.

**Fora de escopo:** `send_selected_list`, `exclude_patients_list`; otimização de filas; mudanças de produto nos defaults abaixo sem atualizar este documento.

---

## Princípios (guias do projeto)

Seguir `docs/CONTROLLER_GUIDE.md`, `docs/USECASE_GUIDE.md` e `docs/ENTITY_GUIDE.md` (e o mapper `.agent/skills/quiro-malu-backend-guides/SKILL.md`):

| Camada | Responsabilidade |
|--------|------------------|
| **Controller** | Garantir payload/rota **completos e coerentes** antes do `execute`: `name`, `kind`, `params.amount` obrigatórios onde couber; `amount` inteiro **1–50**; normalização (`trim` em `name`); `400` com `ApiError` + `type` de campo quando inválido. |
| **Use case** | **Presume** DTO já válido; **não** revalidar `typeof` / `!== undefined` só por causa da HTTP. Orquestrar entidade + repositório; tratar **regras de negócio** que não sejam “forma do request” (ex.: estratégia não encontrada no update). |
| **Entidade / model** | **Presume** valores já consistentes com o contrato do use case; **evitar** guardas defensivas de formulário. Invariantes de **domínio** que ainda forem obrigatórias pelo produto devem ficar em **tiny types** (ex.: `MessageSendStrategyDisplayName`) ou ser expressas no **controller** — para `amount` 1–50, **preferir validação só no controller** nesta task para alinhar ao exemplo pedido. |

> **Nota:** o modelo `SendMostRecentPatientsMessageSendStrategy` ainda contém `parseAmount` / checagens herdadas; na implementação de **frequência** não replique esse padrão defensivo — use `amount: number` já garantido pelo controller. Opcional em PR separado: refatorar “recentes” para o mesmo critério.

---

## 1. Constantes e tipagem (`kind`)

1.1. Em `src/core/messages/sendStrategy/sendStrategyKind.ts`, exportar constante espelhando o literal já presente em `SEND_STRATEGY_KINDS`, por exemplo:

- `SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS = "send_most_frequency_patients" as const`  
  (evita strings mágicas e facilita `switch` / mapeamentos.)

1.2. Em `src/core/messages/sendStrategy/messageSendStrategyKindTypeMaps.ts`, estender os mapeamentos para o kind de frequência:

- `MessageSendStrategyParamsByKind` / `MessageSendStrategyCreateParamsByKind` / `MessageSendStrategyDTOForKind` com **`{ amount: number }`** para esse `kind` (igual “recentes”: só `amount` em `params`; `name` no corpo/DTO de criação como hoje).

---

## 2. Domínio — entidade (persistência / API)

2.1. Criar **`SendMostFrequencyPatientsMessageSendStrategy`** em `src/core/messages/models/`, análoga a `SendMostRecentPatientsMessageSendStrategy`:

- `extends Entity`, campos `displayName: MessageSendStrategyDisplayName`, `amount: number`.
- Construtor recebe DTO interno com `id?`, `displayName`, `amount` (**`number`**, sem `parseAmount(unknown)`).
- `get kind` retornando `SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS`.
- `getApiDTO(userId, campaignBindingsCount)` retornando o tipo discriminado correto em `MessageSendStrategyDTOForKind<...>`.

2.2. **Não** adicionar validação de intervalo 1–50 na entidade nesta task (fica no controller). Se precisar de helper para **ler** `params` já persistidos no factory, preferir leitura mínima (`Number(row.params.amount)`) no **factory** ou no use case de leitura — não como “validação de request”.

---

## 3. Casos de uso — CRUD parcial

3.1. **`CreateMessageSendStrategyUseCase`:** novo `case` para `SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS` — instanciar entidade, `save` com `params: { amount: entity.amount }` (mesmo padrão Knex/JSON que “recentes”).

3.2. **`UpdateMessageSendStrategyUseCase`:** novo `case` no `switch` — mesmo padrão de patch `kind` + `name` + `params` substituídos.

3.3. **Controllers** `CreateMessageSendStrategyController` / `UpdateMessageSendStrategyController`:

- Validar `amount` (inteiro, 1–50) e `name` não vazio / tamanho quando `kind` for frequência (ou validar sempre que `params.amount` vier no body, conforme contrato da rota).
- Montar o DTO passado ao use case já normalizado.

3.4. Testes `*.spec.ts` dos use cases afetados: cenários felizes + erro **400** disparado a partir do **controller** ou de validação explícita no controller (não exigir que o use case lance por `amount` inválido se a validação for só no controller).

---

## 4. Runtime — `allowsSend` (envio)

4.1. Criar classe **`SendMostFrequencyPatientsStrategy`** em `src/core/messages/sendStrategy/strategies/` implementando `IMessageSendStrategy`:

- `readonly kind` = constante de frequência.
- Construtor: `amount: number` (já vindo da factory após leitura da row) + dependência para consultar ranking por contagem de agendamentos.

4.2. **Repositório — novo método** (escolha **uma** interface; alinhar ao spec “Pendências / defaults”):

- Sugestão: em **`ISchedulingRepository`** + `KnexSchedulingRepository`, método do tipo  
  `listPatientIdsByUserIdOrderBySchedulingCountDesc(userId: string, limit: number): Promise<string[]>`
- **Semântica (default alinhado ao spec):** contar agendamentos **não cancelados** por `patientId` + `userId`; ordenar DESC por contagem; empate por `patient.created_at` DESC (ou documentar desempate alternativo na PR).
- Garantir apenas pacientes do `userId` no resultado.
- Atualizar **mock** de agendamentos usado em testes, se existir.

4.3. **`MessageSendStrategyFactory.create`:** branch para `row.kind === SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS` instanciando `SendMostFrequencyPatientsStrategy` com `amount` derivado de `row.params` e injetando o repositório escolhido.

4.4. **`MessageSendStrategyEnforcer`** (ou ponto que hoje chama a factory): passar a dependência nova exigida pela factory (ex.: `ISchedulingRepository`) — espelhar o padrão já usado com `IPatientRepository` para “recentes”.

4.5. Testes unitários da strategy com **mock** do repositório: `allowsSend` true/false para paciente dentro/fora do top N.

---

## 5. Checklist de regressão

- [ ] `POST` / `PATCH` com `send_most_frequency_patients` persistem `params` JSON corretamente (incl. `JSON.stringify` no update Knex se aplicável).
- [ ] `GET` estratégia / listagem retornam `kind` e `params` coerentes.
- [ ] `SendBirthdayMessageUseCase` / `SendBeforeScheduleMessageUseCase` / `SendAfterScheduleMessageUseCase` continuam aplicando enforcer; com estratégia de frequência ativa, `allowsSend` usa contagem de agendamentos.
- [ ] Sem estratégia para a campanha: comportamento atual (enviar se demais regras passarem).

---

## 6. Referência rápida — spec

| Item | Valor |
|------|--------|
| `kind` | `send_most_frequency_patients` |
| `params` | `{ "amount": number }` inteiro **1–50** (validação na camada de entrada / controller, conforme seção 1 deste doc) |
| Onde aplicar filtro | Já integrado nos três `Send*UseCase` via enforcer + factory — **apenas** estender factory + strategy + repo |

---

## 7. Ordem sugerida de implementação

1. Constante `kind` + maps TypeScript.  
2. Entidade `SendMostFrequencyPatientsMessageSendStrategy`.  
3. Método de listagem por frequência no repositório escolhido + mock.  
4. `SendMostFrequencyPatientsStrategy` + factory + wiring do enforcer/filas de index.  
5. Create/Update use cases + validação nos controllers.  
6. Testes (use cases, factory/strategy, repositório se houver spec dedicada).
