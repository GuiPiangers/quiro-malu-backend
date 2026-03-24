# Task 02 — MessageLog (MongoDB) + Repositório

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Registrar rastreabilidade de envio/falha de cada mensagem WhatsApp em MongoDB, conforme `MessageLogDTO` do spec.

## Escopo
- Criar entidade/tipo `MessageLogDTO`.
- Criar schema Mongoose (`MessageLogModel`).
- Criar interface `IMessageLogRepository` e implementação usando Mongoose.
- Criar mock de repositório para testes unitários de use cases.

## Implementação (passo a passo)
1. Criar model em `src/core/messageCampaign/models/MessageLog.ts` (ou módulo equivalente):
   - Definir `MessageOrigin` e `MessageStatus`.
   - Definir `MessageLogDTO` exatamente como no spec.
2. Criar schema em `src/database/mongoose/schemas/MessageLogSchema.ts`:
   - Campos indexados: `patientId`, `campaignId`.
   - Enum para `origin` e `status`.
   - `timestamps: true`.
3. Criar interface em `src/repositories/messaging/IMessageLogRepository.ts` com métodos do spec:
   - `save`, `saveMany`
   - `getByPatient`, `getByCampaign`
   - `countByCampaign`
   - `existsBySchedulingAndCampaign`
4. Criar implementação `src/repositories/messaging/MessageLogRepository.ts` usando Mongoose:
   - `save` → `MessageLogModel.create`
   - `saveMany` → `insertMany`
   - `getByPatient` → `find({ patientId }).limit().skip().sort({ createdAt: -1 })`
   - `countByCampaign` → agregação ou 2 counts.
   - `existsBySchedulingAndCampaign` → `exists`/`findOne`.

## Testes unitários
### Mock
1. Criar `src/repositories/_mocks/MessageLogRepositoryMock.ts` seguindo o padrão dos outros mocks:
   - Expor `createMockMessageLogRepository()` retornando objeto com `jest.fn()` para todos os métodos.

### Repository (opcional)
Se optar por testar a implementação real, focar em testes unitários leves (sem Mongo real) é difícil.
Preferir testes unitários no nível de use case usando o mock acima.

## Critérios de aceite
- `IMessageLogRepository` existe e pode ser injetado em `SendMessageUseCase`.
- O schema Mongoose está pronto para alto volume (indexes) e não quebra o boot do `mongoConnect()`.
