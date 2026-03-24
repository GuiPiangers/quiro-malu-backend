# Task 03 — BirthdayMessageConfig (MongoDB singleton) + Repositório

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Criar uma configuração singleton para o horário de disparo do cron de aniversário e qual campanha deve ser usada, conforme o spec.

## Escopo
- Criar DTO/model `BirthdayMessageConfigDTO`.
- Criar schema Mongoose singleton (upsert por ID fixo).
- Criar interface `IBirthdayMessageConfigRepository` + implementação.
- Criar mock para testes unitários.

## Implementação (passo a passo)
1. Criar model em `src/core/messageCampaign/models/BirthdayMessageConfig.ts`:
   - `campaignId: string`
   - `sendHour: number (0–23)`
   - `sendMinute: number (0–59)`
2. Criar schema em `src/database/mongoose/schemas/BirthdayMessageConfigSchema.ts`:
   - Validar min/max.
   - Implementar upsert (documento único).
   - Usar um `_id` fixo (ex.: `birthday_config`) para garantir singleton.
3. Criar interface `src/repositories/messaging/IBirthdayMessageConfigRepository.ts`:
   - `get(): Promise<BirthdayMessageConfigDTO | null>`
   - `save(config): Promise<void>` (upsert)
4. Implementar `src/repositories/messaging/BirthdayMessageConfigRepository.ts` com Mongoose.

## Testes unitários
### Mock
1. Criar `src/repositories/_mocks/BirthdayMessageConfigRepositoryMock.ts`:
   - `get: jest.fn()`
   - `save: jest.fn()`

### Use cases (se aplicável)
Quando o fluxo de birthdayQueue for implementado, usar este mock para testar:
- quando não existe config → não enfileira nada.
- quando existe config → usa `sendHour/sendMinute` para cron e `campaignId` para buscar campanha.

## Critérios de aceite
- Repositório permite ler/salvar a config sem múltiplos documentos.
- Tipos/validações impedem valores inválidos de hora/minuto.
