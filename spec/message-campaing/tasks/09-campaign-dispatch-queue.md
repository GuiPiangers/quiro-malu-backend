# Task 09 — campaignDispatchQueue (cron 1 min) para campanhas agendadas

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Processar campanhas com `status: 'SCHEDULED'` e `scheduledAt <= now`, resolver audiência e enfileirar envios na `sendMessageQueue`, atualizando status para `DONE`/`FAILED`.

## Dependências
- `MessageCampaignDTO` precisa dos campos de execução (`status`, `scheduledAt`, etc.).
- `IMessageCampaignRepository` precisa de:
  - `listScheduledUntil(date)`
  - `update(id, data)`
- `AudienceResolverFactory` (task 08).

## Implementação (passo a passo)
1. Criar fila/worker (sugestão): `src/queues/campaignDispatch/CampaignDispatchQueue.ts`.
2. Configurar repetição cron `* * * * *` (a cada 1 minuto) usando `QueueProvider.repeat` com `jobId` fixo.
3. No processamento:
   - `campaigns = messageCampaignRepository.listScheduledUntil(new Date())`.
   - Para cada campanha:
     - `update(id, { status: 'PROCESSING' })` imediatamente.
     - `resolver = audienceResolverFactory.make(campaign.audienceType)`
     - `patients = await resolver.resolve(campaign)`
     - Para cada paciente, `sendMessageQueue.add({ patientId, userId, messageCampaign: campaign, origin: 'CAMPAIGN' })`
     - `update(id, { status: 'DONE', lastDispatchAt: new Date(), lastDispatchCount: patients.length })`
   - Em erro: `update(id, { status: 'FAILED' })`.

## Testes unitários
1. Criar teste: `src/queues/campaignDispatch/tests/CampaignDispatchQueue.spec.ts`.
2. Mocks:
   - `messageCampaignRepository` com `listScheduledUntil` + `update`.
   - `audienceResolverFactory` e um resolver fake com `resolve`.
   - `sendMessageQueue` mock (com `add: jest.fn()`).
   - `queueProvider` mock (repeat/process).
3. Casos mínimos:
   - Campanha SCHEDULED → marca PROCESSING → enfileira N pacientes → marca DONE com `lastDispatchCount`.
   - Se resolver lançar erro → marca FAILED.
   - Não processa quando `listScheduledUntil` retornar vazio.

## Critérios de aceite
- Não reprocessa campanhas paralelamente (status PROCESSING antes de resolver audiência).
- Sempre atualiza status para DONE/FAILED.
