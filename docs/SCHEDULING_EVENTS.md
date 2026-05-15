# Listagem de agenda: eventos vs. agendamentos “puros”

## O que usar (preferido)

- **Caso de uso:** `src/core/scheduling/useCases/listEvents/ListEventsUseCase.ts` — `ListEventsUseCase`
- **Controller:** `src/core/scheduling/controllers/ListEventsController/` — `ListEventsController`
- **Rota HTTP:** `GET /events` (permissão `events:read`), registrada em `src/router.ts`

Esse fluxo devolve **agendamentos e bloqueios de agenda no mesmo array** (`data` com itens discrimináveis), adequado ao calendário unificado na UI.

## Legado (evitar em código novo)

- **Caso de uso:** `src/core/scheduling/useCases/listScheduling/ListSchedulingUseCase.ts` — `ListSchedulingUseCase`
- **Controller:** `src/core/scheduling/controllers/listSchedulingController/` — `ListSchedulingController`
- **Rota HTTP:** `GET /schedules` (permissão `schedules:read`)

Lista apenas agendamentos com dados de paciente (paginação implícita via `limit`), **sem** mesclar bloqueios. Mantido por compatibilidade; **não** estender esse caminho para novas features de calendário.

## Resumo para agentes (IA)

Ao implementar ou refatorar listagem diária da agenda / calendário:

1. Preferir sempre **`ListEventsUseCase`** e **`listEventsController`** / **`GET /events`**.
2. Não duplicar lógica em `ListSchedulingUseCase` / `ListSchedulingController` salvo correção pontual de legado.
3. Contratos OpenAPI: schemas em `schedulingSharedSchemas` / `schedulingResponseSchemas` e paths em `src/docs/paths/schedulingPaths.ts` alinhados a **list events**.
