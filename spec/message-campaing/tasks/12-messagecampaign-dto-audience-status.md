# Task 12 — Atualizar MessageCampaignDTO (audience + status de execução)

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Atualizar `MessageCampaignDTO` para suportar campanhas agendadas e segmentação, conforme o spec:
- Campos de audiência (`audienceType`, `audienceLimit`, `audienceOffsetMinutes`, `audiencePatientIds`)
- Campos de execução (`status`, `scheduledAt`, `lastDispatchAt`, `lastDispatchCount`)

## Contexto (estado atual)
- DTO atual está em `src/core/messageCampaign/models/MessageCampaign.ts`.
- Persistência atual usa Mongoose schema em `src/database/mongoose/schemas/MessageCampaign.ts`.

## Implementação (passo a passo)
1. Atualizar `MessageCampaignDTO` em `src/core/messageCampaign/models/MessageCampaign.ts`:
   - Adicionar tipos `CampaignAudienceType`.
   - Adicionar campos opcionais de audiência.
   - Adicionar campos de execução e status (`DRAFT|SCHEDULED|PROCESSING|DONE|FAILED`).
2. Atualizar o construtor e `getDTO()`:
   - Garantir que `getDTO()` inclua os novos campos.
3. Persistência:
   - Se mantiver MongoDB: atualizar `src/database/mongoose/schemas/MessageCampaign.ts` adicionando os novos campos.
   - Se migrar para MySQL (como o spec sugere): criar tabela/migration e refatorar `MessageCampaignRepository` para Knex.
4. Atualizar controllers/use cases de create/list (se necessário) para aceitar/retornar os novos campos.

## Testes unitários
1. Atualizar `src/core/messageCampaign/models/tests/MessageCampaign.spec.ts`:
   - Garantir que `getDTO()` inclua os novos campos.
   - Cobrir default/undefined quando campos opcionais não são enviados.
2. Se alterar repositório:
   - Atualizar/crear mocks e testes de use case de create/list para refletir novos campos.

## Critérios de aceite
- DTO atualizado sem quebrar os fluxos existentes (campos novos opcionais).
- `getDTO()` e testes refletem os novos campos.
