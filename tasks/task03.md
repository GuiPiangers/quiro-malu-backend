# Task 03 — Estratégia `send_selected_list`

**Referência:** `tasks/sendStrategy.spec.md` (tipos de estratégia, tabela **Validação de `params`**, fluxo `allowsSend`, factory) e **exemplo estrutural** `src/core/messages/models/SendMostRecentPatientsMessageSendStrategy.ts` (entidade `extends Entity`, `displayName`, `get kind`, `getDTO`).

**Objetivo desta tarefa:** permitir criar, atualizar, persistir e aplicar em runtime a estratégia **`send_selected_list`** com parâmetro **`patientIdList: string[]`**, de forma consistente com as estratégias já existentes (CRUD + factory + enforcer nos três `Send*MessageUseCase`).

**Fora de escopo:** `exclude_patients_list`; otimização de filas; mudança de limite de lista sem atualizar este documento e a constante única de validação HTTP.

---

## Princípios (guias do projeto)

Seguir `docs/CONTROLLER_GUIDE.md`, `docs/USECASE_GUIDE.md`, `docs/ENTITY_GUIDE.md` e o mapper `.agent/skills/quiro-malu-backend-guides/SKILL.md`:

| Camada | Responsabilidade |
|--------|------------------|
| **Controller / helpers HTTP** | Garantir forma e limites do **request** antes do `execute`: `name` coerente (via `MessageSendStrategyDisplayName` onde já for o padrão), `kind` + `params.patientIdList` quando a rota exigir; **array** de ids não vazio, tamanho máximo, elementos string não vazias (e normalização opcional: `trim`, deduplicação estável se produto pedir). Erros com `ApiError` + `responseError` nos controllers. |
| **Use case** | Orquestrar persistência: instanciar entidade com DTO **já válido na fronteira HTTP**; **não** reimplementar checagens de `typeof` / “campo obrigatório ausente” / tamanho de lista **só** por causa do JSON bruto. Pode orquestrar **regra de negócio de posse** (todos os `patientId` pertencem ao `userId` da estratégia) chamando o **repositório** — isso é integridade de domínio, não validação de formulário. |
| **Entidade / model** | Espelhar o **formato** de `SendMostRecentPatientsMessageSendStrategy`: `extends Entity`, `displayName: MessageSendStrategyDisplayName`, campo(s) de params já no tipo forte (`readonly patientIdList: string[]`). **Sem** validar tamanho máximo, existência de paciente ou `userId` no construtor da entidade. |

**Limite de `patientIdList`:** a tabela **Validação de `params`** em `sendStrategy.spec.md` cita **50** ids; a seção **Pendências / defaults** sugere **500** configurável. **Escolher um único valor** (constante exportada, ex. `MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS`) usada só na camada HTTP (e em testes do helper); se o produto adotar 500, alterar só essa constante e este parágrafo.

---

## 1. Constantes e tipagem (`kind`)

1.1. Em `src/core/messages/sendStrategy/sendStrategyKind.ts`, exportar:

- `SEND_STRATEGY_KIND_SEND_SELECTED_LIST = "send_selected_list" as const`  
  e usar essa constante em `SEND_STRATEGY_KINDS` no lugar do literal solto (mesmo padrão de `send_most_*`).

1.2. Em `src/core/messages/sendStrategy/messageSendStrategyKindTypeMaps.ts`, estender os mapeamentos discriminados:

- Para `SEND_STRATEGY_KIND_SEND_SELECTED_LIST`: `params` / DTO de criação com **`{ patientIdList: string[] }`** em `MessageSendStrategyParamsByKind`, `MessageSendStrategyCreateParamsByKind` e `MessageSendStrategyDTOForKind`.

---

## 2. Domínio — entidade

2.1. Criar **`SendSelectedListMessageSendStrategy`** em `src/core/messages/models/`, **análoga em forma** a `SendMostRecentPatientsMessageSendStrategy.ts`:

- `extends Entity`.
- Campos: `displayName: MessageSendStrategyDisplayName`, `patientIdList: readonly string[]` (ou `string[]` alinhado ao restante do módulo).
- DTO interno do construtor: `id?`, `displayName`, `patientIdList` — **atribuição direta** da lista (sem validar tamanho nem conteúdo no model).
- `get kind` retornando `SEND_STRATEGY_KIND_SEND_SELECTED_LIST`.
- `getDTO(userId, campaignBindingsCount)` retornando `MessageSendStrategyDTOForKind<typeof SEND_STRATEGY_KIND_SEND_SELECTED_LIST>` com `params: { patientIdList: [...] }`.

2.2. **Não** adicionar no model: `Array.isArray` defensivo, limite de tamanho, verificação de ids duplicados ou existência em banco.

---

## 3. Validação HTTP (entrada)

3.1. Estender (ou criar módulo espelho) os helpers já usados pelos controllers de estratégia:

- `buildValidatedCreateMessageSendStrategyDTO` — branch para `SEND_STRATEGY_KIND_SEND_SELECTED_LIST`: validar `patientIdList` conforme constante de tamanho máximo e regras de elemento (ex.: string não vazia após trim); retornar DTO discriminado tipado.
- `buildValidatedUpdateMessageSendStrategyBody` — quando `kind` + `params` forem enviados juntos para lista selecionada, validar `params.patientIdList` da mesma forma; manter a regra **kind e params juntos** já existente no update.

3.2. **`CreateMessageSendStrategyController` / `UpdateMessageSendStrategyController`:** garantir que o body passa pelos builders antes do use case (já é o padrão atual; apenas cobrir o novo `kind`).

3.3. **`501`:** kinds ainda não suportados continuam a resposta adequada no helper de create (espelhar o tratamento de `send_selected_list` como kind suportado após a task).

---

## 4. Casos de uso — CRUD

4.1. **`CreateMessageSendStrategyUseCase`:** novo `case` para `SEND_STRATEGY_KIND_SEND_SELECTED_LIST`:

- Instanciar `SendSelectedListMessageSendStrategy` com `name` → `MessageSendStrategyDisplayName` (como nas outras estratégias).
- **Antes de `save` (recomendado):** garantir regra de negócio do spec — *todos os ids existem e `patient.userId === strategy.userId`* — via **novo método em `IPatientRepository`** (ex.: contar ou buscar por `userId` + conjunto de ids e comparar com `patientIdList.length`) implementado em `KnexPatientRepository` + mock em testes. Lançar `ApiError` apropriado (ex.: 400 com `type` apontando para `params.patientIdList` ou índice, conforme padrão do projeto) quando a posse não bater. Isso **não** é validação de “tipo do JSON”; é invariante de persistência.

4.2. **`UpdateMessageSendStrategyUseCase`:** novo `case` no `switch` quando `kind` + `params` substituem a estratégia — mesmo patch `kind` + `name` + `params` com `patientIdList`; reutilizar a mesma verificação de posse antes do `update` quando o `kind` resultante for lista selecionada.

4.3. Testes `*.spec.ts` dos use cases: cenários feliz; erro de posse (repo retorna contagem menor / ids inválidos); **não** exigir que o use case lance só por “lista vazia” ou “não é array” se isso for 100% responsabilidade do helper HTTP (testes dedicados do helper ou testes de controller, conforme padrão do repo).

---

## 5. Runtime — `allowsSend`

5.1. Criar **`SendSelectedListStrategy`** em `src/core/messages/sendStrategy/strategies/` implementando `IMessageSendStrategy`:

- `readonly kind` = `SEND_STRATEGY_KIND_SEND_SELECTED_LIST`.
- Construtor: receber `patientIdList: string[]` já materializado pela **factory** a partir de `row.params` (cópia defensiva opcional com spread, sem validar negócio).
- `allowsSend(ctx)`: `patientId` está no conjunto permitido para aquele `userId` implícito na row já aplicada pelo enforcer (o contexto só traz `userId` + `patientId` — a lista já é do dono correto porque veio da estratégia persistida para aquele usuário). Implementação típica: `new Set(this.patientIdList).has(ctx.patientId)`.

5.2. Conforme `sendStrategy.spec.md` (classe `SendSelectedListStrategy`), **não** é obrigatório injetar repositório se a lista em JSON for a fonte da verdade no envio; manter a strategy **enxuta**.

---

## 6. Factory

6.1. Em `MessageSendStrategyFactory` (dependências já injetadas no construtor): novo branch `row.kind === SEND_STRATEGY_KIND_SEND_SELECTED_LIST`.

6.2. Ler `patientIdList` de `row.params` com função **mínima** no factory (ex.: garantir array de strings para JSON legado corrompido — se inválido, `ApiError` 500 com `type` adequado, **não** duplicar regras de negócio de posse/tamanho que já rodaram na gravação).

---

## 7. Enforcer e wiring

7.1. **`MessageSendStrategyEnforcer`** já delega à factory; **não** exige alteração de assinatura se a strategy de lista não precisar de repo extra.

7.2. Regressão: `SendBirthdayMessageUseCase` / `SendBeforeScheduleMessageUseCase` / `SendAfterScheduleMessageUseCase` continuam usando o enforcer; com estratégia `send_selected_list` ativa, `allowsSend` reflete a lista persistida.

---

## 8. Testes sugeridos

- Unitário **`SendSelectedListStrategy`:** `allowsSend` true quando `patientId` na lista; false quando fora; lista vazia da factory → false para qualquer paciente (comportamento derivado, sem validar no model).
- **Create / Update use cases:** persistência correta de `params` JSON; erro quando repo de posse falha.
- **Helpers HTTP:** lista acima do máximo; elemento vazio; não-array (se aplicável).

---

## 9. Checklist de regressão

- [ ] `POST` / `PATCH` com `send_selected_list` persistem `params.patientIdList` no JSON.
- [ ] `GET` / listagem retornam `kind` e `params` coerentes.
- [ ] Envios com estratégia ativa respeitam a lista; sem estratégia para a campanha, comportamento atual mantido.

---

## 10. Ordem sugerida de implementação

1. Constante `kind` + maps TypeScript.  
2. Entidade `SendSelectedListMessageSendStrategy`.  
3. Helpers HTTP (create + update) + ajuste nos controllers se necessário.  
4. Método de posse em `IPatientRepository` + Knex + mock.  
5. `CreateMessageSendStrategyUseCase` + `UpdateMessageSendStrategyUseCase`.  
6. `SendSelectedListStrategy` + branch na `MessageSendStrategyFactory`.  
7. Testes (strategy, use cases, helpers).
