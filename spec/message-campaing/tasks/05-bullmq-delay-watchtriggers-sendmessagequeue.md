# Task 05 — BullMQ delay correto (watchTriggers + sendMessageQueue)

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Garantir que triggers com delay sempre resultem em jobs BullMQ com `delay` em milissegundos (nunca `setTimeout`) e que o delay seja calculado corretamente tanto para eventos de paciente quanto de agendamento.

## Contexto (estado atual)
- `MessageCampaign.watchTriggers()` emite o evento interno `watchTriggers`.
- O handler em `src/start/index.ts` chama `sendMessageQueue.add(...)`.
- `sendMessageQueue.add` hoje só calcula delay quando `date` é passado.

Isso quebra triggers do tipo `TriggerWithDelay` quando `date` não vem no payload (ex.: createPatient), pois o delay fica `undefined`.

## Implementação (passo a passo)
1. Ajustar o fluxo para sempre calcular delay:
   - Para eventos de paciente, usar `DateTime.now()` como base.
   - Para eventos de schedule, usar `new DateTime(data.date)` quando existir.
2. Opções de implementação (escolher 1):
   - **Opção A (recomendada):** ajustar `SendMessageQueue.add()` para usar `date ?? DateTime.now()`.
   - **Opção B:** garantir que `MessageCampaign.watchTriggers()` sempre envie `date` no payload do evento `watchTriggers`.
3. Garantir que o `delay` passado para o BullMQ seja o retorno de `trigger.calculateDelay(...)` (ms).
4. (Opcional/organização) No payload do job, incluir `origin` conforme o spec (`CAMPAIGN`, `APPOINTMENT_REMINDER`, etc.).

## Testes unitários
### sendMessageQueue
1. Criar/atualizar testes para `SendMessageQueue` (se não existir):
   - Arquivo sugerido: `src/repositories/queueProvider/sendMessageQueue/tests/SendMessageQueue.spec.ts`.
2. Criar mocks:
   - Mock de `IQueueProvider` (factory em `src/repositories/_mocks/QueueProviderMock.ts` ou mock inline no teste).
   - Mock de `SendMessageUseCase` com `execute: jest.fn()`.
3. Casos mínimos:
   - Quando `date` não é passado, deve chamar `queueProvider.add` com `delay` calculado a partir de `DateTime.now()`.
   - Quando `date` é passado, deve usar essa data como base do `calculateDelay`.

### watchTriggers
Atualizar `src/core/messageCampaign/models/tests/MessageCampaign.spec.ts` para refletir o payload:
- Se a decisão for a Opção B, ajustar expectativas para sempre conter `date`.

## Critérios de aceite
- Triggers com delay funcionam para eventos sem `date`.
- O BullMQ recebe `delay` em milissegundos em todos os casos.
