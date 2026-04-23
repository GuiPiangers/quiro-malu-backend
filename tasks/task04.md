# Task 04 — Estratégia `exclude_patients_list`

**Referência:** `tasks/sendStrategy.spec.md` (tipos de estratégia, tabela **Validação de `params`**, `allowsSend`, factory, classes de strategy) e **implementação já existente** da task 03 (`send_selected_list`): entidade, helpers HTTP de lista, `IPatientRepository.countPatientsOwnedByUser`, `CreateMessageSendStrategyUseCase` / `UpdateMessageSendStrategyUseCase`, `MessageSendStrategyFactory`, padrão de testes.

**Objetivo desta tarefa:** permitir criar, atualizar, persistir e aplicar em runtime a estratégia **`exclude_patients_list`** com parâmetro **`patientIdList: string[]`**, espelhando o fluxo de **`send_selected_list`**, com **semântica invertida** no envio: barrar apenas os pacientes presentes na lista; todos os demais continuam elegíveis.

**Fora de escopo:** novos tipos de estratégia; otimização de filas; alteração do limite máximo de ids sem atualizar este documento e a constante de domínio/HTTP alinhada.

---

## Semântica de negócio (`allowsSend`)

| Cenário | Comportamento esperado |
|--------|-------------------------|
| `patientId` **está** em `patientIdList` (lista de exclusão) | `allowsSend` → **`false`** (não enviar). |
| `patientId` **não está** na lista | `allowsSend` → **`true`**. |
| Lista de exclusão **vazia** após normalização | Ninguém excluído → `allowsSend` → **`true`** para qualquer `patientId` (equivalente a “sem filtro” para exclusão). |

O contrato `SendStrategyContext` permanece `{ userId, patientId }` — a lista vem só da row persistida; não expandir o contexto.

---

## Princípios (guias do projeto)

Seguir `docs/CONTROLLER_GUIDE.md`, `docs/USECASE_GUIDE.md`, `docs/ENTITY_GUIDE.md` e o mapper `.agent/skills/quiro-malu-backend-guides/SKILL.md` — **mesmo recorte de responsabilidades da task 03**:

| Camada | Responsabilidade |
|--------|------------------|
| **Controller / helpers HTTP** | Validar **forma** do body (`patientIdList` como array de strings não vazias após trim, dedupe estável se adotado o mesmo padrão da lista selecionada, limite máximo). Reutilizar ou extrair helper compartilhado com `send_selected_list` se fizer sentido (evitar duplicação de regras de parsing). |
| **Use case** | DTO já validado na entrada HTTP; orquestrar entidade + `save` / `update`; **posse** dos pacientes via `countPatientsOwnedByUser` (mesma regra do spec: ids existem e pertencem ao `userId`). |
| **Entidade / model** | `extends Entity`, `displayName`, `patientIdList` com o mesmo estilo de **`SendSelectedListMessageSendStrategy`** (incl. dedupe / limites se já estiverem centralizados na entidade de lista, **ou** constante compartilhada entre os dois kinds de lista). |

**Limite de `patientIdList`:** em `sendStrategy.spec.md` a validação de **`exclude_patients_list`** é **“Idem validação de posse e limite”** em relação a `send_selected_list` (tabela **50** ids); pendências citam **500**. Manter **uma** política de limite alinhada ao que já estiver em produção para `send_selected_list` (reutilizar constante ou renomear para nome neutro, ex. limite por lista de ids de pacientes em estratégias de mensagem).

---

## 1. Constantes e tipagem (`kind`)

1.1. Em `src/core/messages/sendStrategy/sendStrategyKind.ts`:

- Exportar `SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST = "exclude_patients_list" as const`.
- Substituir o literal em `SEND_STRATEGY_KINDS` pela constante.

1.2. Em `src/core/messages/sendStrategy/messageSendStrategyKindTypeMaps.ts`:

- Tratar **`exclude_patients_list`** no mesmo “grupo” de params que **`send_selected_list`**: **`{ patientIdList: string[] }`** em `MessageSendStrategyParamsByKind`, `MessageSendStrategyCreateParamsByKind` e `MessageSendStrategyDTOForKind` (pode ser um tipo auxiliar `MessageSendStrategyPatientListParamKinds` com os dois literals, como já feito para `amount`).

---

## 2. Domínio — entidade

2.1. Criar **`ExcludePatientsListMessageSendStrategy`** (ou nome alinhado ao padrão do módulo) em `src/core/messages/models/`:

- Espelho estrutural de **`SendSelectedListMessageSendStrategy`** (`displayName`, `patientIdList`, `get kind`, `getDTO`).
- `get kind` → `SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST`.

2.2. Reaproveitar invariantes comuns (dedupe, limites) **só onde já existir padrão** para lista selecionada — evitar três cópias divergentes da mesma regra.

---

## 3. Validação HTTP (entrada)

3.1. Estender **`buildValidatedCreateMessageSendStrategyDTO`** e **`buildValidatedUpdateMessageSendStrategyBody`** para o novo `kind`:

- Mesmas regras de **`patientIdList`** que para `send_selected_list` (ideal: função única `parseHttpPatientIdList` ou equivalente já usada pela task 03).
- **`501`:** não aplicável a este kind após a implementação; kinds futuros continuam com o tratamento atual.

---

## 4. Casos de uso — CRUD

4.1. **`CreateMessageSendStrategyUseCase`:** `case` para `SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST` — entidade + `assertAllPatientsOwnedByUser` + `save` com `params: { patientIdList: [...] }`.

4.2. **`UpdateMessageSendStrategyUseCase`:** incluir o kind no fluxo de substituição completa (`buildExclude…FullReplacePatch` ou ramo no `switch` / mapa de resolução, seguindo o padrão refatorado após a task 03).

4.3. Testes: feliz + falha de posse + regressão dos outros kinds.

---

## 5. Runtime — `allowsSend`

5.1. Criar **`ExcludePatientsListStrategy`** em `src/core/messages/sendStrategy/strategies/`:

- `readonly kind` = `SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST`.
- Construtor: `patientIdList: string[]` a partir de `row.params` (confiar no JSON persistido, **mesmo padrão** que `SendSelectedListStrategy`).
- `allowsSend(ctx)`: **`!this.excludedIds.has(ctx.patientId)`** (com `Set` em memória no construtor).

5.2. Sem repositório na strategy se a lista persistida for suficiente (spec: idem `SendSelectedListStrategy`).

---

## 6. Factory

6.1. Novo branch em **`MessageSendStrategyFactory.create`**: `row.kind === SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST` → `new ExcludePatientsListStrategy(patientIdList)` com leitura mínima de `row.params` (confiar nos dados gravados pelo CRUD).

---

## 7. Enforcer / sends

7.1. Nenhuma mudança de assinatura esperada no **`MessageSendStrategyEnforcer`** se a factory já cobrir o novo kind.

7.2. Regressão: com estratégia de exclusão ativa, pacientes na lista não recebem mensagem naquela campanha; sem estratégia, comportamento atual.

---

## 8. Testes sugeridos

- Unitário **`ExcludePatientsListStrategy`:** paciente na lista → `false`; fora da lista → `true`; lista vazia → `true`.
- **Create / Update** use cases: persistência e posse.
- **Helper HTTP** (se houver branch dedicada): limite / elemento inválido.

---

## 9. Checklist de regressão

- [ ] `POST` / `PATCH` com `exclude_patients_list` persistem `params.patientIdList`.
- [ ] Listagem / `GET` retornam `kind` e `params` coerentes.
- [ ] `send_selected_list` e demais kinds não regressam.

---

## 10. Ordem sugerida de implementação

1. Constante `kind` + maps TypeScript.  
2. Entidade `ExcludePatientsListMessageSendStrategy`.  
3. Helpers HTTP (create + update).  
4. `CreateMessageSendStrategyUseCase` + `UpdateMessageSendStrategyUseCase`.  
5. `ExcludePatientsListStrategy` + factory.  
6. Testes (strategy, use cases, helper se aplicável).
