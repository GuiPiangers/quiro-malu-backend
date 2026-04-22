---
name: quiro-malu-backend-guides
description: Operational mapper for this repo’s backend architecture guides. Use when implementing/refactoring endpoints, business logic, entities, or persistence and you need to decide which guide in `docs/` to follow and apply the project patterns (controllers/use cases/repositories/entities, `ApiError` + `responseError`, `DateTime`).
---

# QUIRO MALU BACKEND GUIDES (MAPPER SKILL)

Operational intelligence to select and apply the right `docs/` guide on-demand.

## OPERATIONAL PROTOCOL

```
1. Identify task domain (Controller / UseCase / Entity / Repository / Project-wide)
2. Match keywords to Guide Index triggers
3. Load the minimum set of guides (🔴 → 🟠) — never preload everything
4. Apply the guide pattern + confirm real code examples in `src/`
5. Add/adjust tests near the use case when behavior changes
```

Priority order:
- 🔴 CRITICAL: architecture + API patterns
- 🟠 HIGH: persistence + domain modeling

## GUIDE INDEX (docs/)

| Guide | Priority | Triggers (examples) | Purpose |
|---|---:|---|---|
| `docs/PROJECT_GUIDE.md` | 🔴 | estrutura, pasta, padrão do projeto, erro, ApiError, DateTime, datas, testes | Repo-wide conventions (folders, errors, dates, tests) |
| `docs/CONTROLLER_GUIDE.md` | 🔴 | endpoint, rota, router, express, request, response, status, responseError, controller | Build HTTP controllers + wire in `src/router.ts` |
| `docs/USECASE_GUIDE.md` | 🔴 | regra de negócio, fluxo, execute, DTO, validação, duplicidade, caso de uso | Implement application logic (`execute`) with repo interfaces |
| `docs/ENTITY_GUIDE.md` | 🟠 | entidade, model, domínio, tiny type, Entity, getDTO | Encapsulate domain rules/data as entities in `models/` |
| `docs/REPOSITORY_GUIDE.md` | 🟠 | knex, mysql, query, tabela, ETableNames, repository, persistência, findBy, save | Implement data access via repository interfaces |

## QUICK DECISION TREE

```
Add/change an endpoint (route + handler)
  → Load: PROJECT_GUIDE (🔴), CONTROLLER_GUIDE (🔴)
  → Confirm: `src/router.ts` wiring and auth middleware usage

Change business rules / orchestration
  → Load: PROJECT_GUIDE (🔴), USECASE_GUIDE (🔴)
  → Confirm: `src/core/<module>/useCases/*`

Model new domain concept / validation
  → Load: PROJECT_GUIDE (🔴), ENTITY_GUIDE (🟠)
  → Confirm: `src/core/<module>/models/*` and TinyTypes in `src/core/shared/*`

Persist/query data (Knex/MySQL/etc.)
  → Load: PROJECT_GUIDE (🔴), REPOSITORY_GUIDE (🟠)
  → Confirm: `src/repositories/<module>/*`, `src/database/ETableNames.ts`
```

## PROJECT-SPECIFIC RULES (DO / DON'T)

Errors (mandatory):
- DO: `throw new ApiError(message, statusCode?, type?)` (`src/utils/ApiError.ts`)
- DO: controllers catch and return `responseError(response, err)` (`src/utils/ResponseError.ts`)
- DON'T: throw plain `Error` for domain/API failures

Dates (mandatory):
- DO: use `DateTime` from `src/core/shared/Date.ts`
- DO: keep DTO date fields as string (e.g. `"2025-05-05T10:00"`)
- DON'T: use Luxon `DateTime` directly

## FOLDER CONVENTIONS (REAL CODE)

- Controllers: `src/core/<module>/controllers/<foo>Controller/<Foo>Controller.ts` + `index.ts`
- UseCases: `src/core/<module>/useCases/<foo>/<Foo>UseCase.ts` (+ `tests/*.spec.ts`)
- Entities: `src/core/<module>/models/<Entity>.ts` (extends shared `Entity` + `getDTO()`)
- Repos: `src/repositories/<module>/I<Module>Repository.ts` (+ implementations, `_mocks`)
- Routes: `src/router.ts`

## IMPLEMENTATION CHECKLISTS

Controller:
- Keep `handle(req, res)` thin: parse input, call `useCase.execute`, return JSON.
- Wrap with `try/catch` and always use `responseError(res, err)`.
- Wire route in `src/router.ts` (REST naming) and add `authMiddleware` when required.
- **Validate/normalize HTTP input here** (required fields, acceptable types); use cases and entities presume the DTO is already contract-correct.

UseCase:
- Constructor receives repository interfaces (`I*Repository`), not concrete classes.
- `execute(dto, userId?)` returns output DTO (or entity DTO) consistently.
- **Do not** redundantly re-check DTO field presence/types “because HTTP”; apply **business rules** only (duplicates, illegal state, etc.) and use entities/tiny types for **domain** invariants.
- Tests colocated under `src/core/<module>/useCases/<foo>/tests/*.spec.ts`; reuse mocks from `src/repositories/_mocks`.

Entity:
- `extends Entity` (`src/core/shared/Entity.ts`), ctor receives a DTO-like object.
- Expose `getDTO()`; keep domain logic here when appropriate.
- **Assume** ctor input was validated at the controller; avoid defensive HTTP-shape checks; domain rules (via tiny types / entity logic) stay here.

Repository:
- Interface first (prefer one-parameter object when it improves evolvability).
- Implementation uses Knex + `ETableNames`.
- For date columns: read/write as string (`yyyy-MM-ddTHH:mm`) or `DateTime`.

## FAST DISCOVERY (SEARCH PATTERNS)

```
rg -n "export class .*Controller" src/core
rg -n "async handle\\(" src/core
rg -n "export class .*UseCase" src/core
rg -n "async execute\\(" src/core
rg -n "extends Entity" src/core
rg -n "export interface I.*Repository" src/repositories
```
