# Task 08 — Audience Resolvers + Factory (campanhas agendadas)

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Implementar resolução de audiência para campanhas agendadas (segmentação) via `AudienceResolverFactory` e resolvers dedicados.

## Escopo
- Criar interface `IAudienceResolver`.
- Criar `AudienceResolverFactory`.
- Criar resolvers:
  - `MostRecentAudienceResolver`
  - `MostFrequentAudienceResolver`
  - `AfterAppointmentAudienceResolver`
  - `BeforeAppointmentAudienceResolver`
  - `SpecificPatientsAudienceResolver`

## Implementação (passo a passo)
1. Criar pasta `src/core/messageCampaign/audience/`.
2. Criar `IAudienceResolver.ts`:
   - `resolve(campaign: MessageCampaignDTO): Promise<PatientDTO[]>`.
3. Criar `AudienceResolverFactory.ts` que recebe `IPatientRepository` e `ISchedulingRepository` e retorna o resolver correto baseado em `campaign.audienceType`.
4. Implementar cada resolver seguindo o spec:
   - Limitar `audienceLimit` a no máximo 100.
   - Tratar campos opcionais (`audienceOffsetMinutes`, `audiencePatientIds`).

> Dependências: alguns métodos ainda não existem nos repositórios (`getMostRecent`, `getMostFrequent`, `listFromNowWithinMinutes`, etc.). Se necessário, criar esses métodos em tasks separadas (ver tasks 10 e 11).

## Testes unitários
1. Criar testes por resolver (pasta sugerida): `src/core/messageCampaign/audience/tests/`.
2. Usar mocks já existentes:
   - `createMockPatientRepository()`
   - `createMockSchedulingRepository()`
3. Casos mínimos:
   - Factory retorna a classe correta para cada `audienceType`.
   - `MostRecentAudienceResolver` chama `patientRepository.getMostRecent(limit)` com `min(limit, 100)`.
   - `MostFrequentAudienceResolver` chama `patientRepository.getMostFrequent(limit)` com `min(limit, 100)`.
   - `SpecificPatientsAudienceResolver` parseia JSON, limita 100 IDs, chama `patientRepository.getById` e filtra nulos.
   - `After/BeforeAppointmentAudienceResolver` chama os métodos do scheduling repo com `audienceOffsetMinutes`.

## Critérios de aceite
- Resolvers são testáveis isoladamente (sem BullMQ e sem DB real).
- Factory cobre todos os `CampaignAudienceType` e não retorna `undefined`.
