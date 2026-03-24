# Task 11 — Extender ISchedulingRepository (janelas de tempo + reminderSentAt)

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Adicionar métodos ao `ISchedulingRepository` para suportar resolvers e controle de lembretes, conforme o spec:
- `listFromNowWithinMinutes(offsetMinutes)`
- `listScheduledInMinutes(offsetMinutes)`
- `listUpcoming(windowMinutes)`
E adicionar o campo `reminderSentAt` no DTO/DB.

## Implementação (passo a passo)
1. Atualizar `src/core/scheduling/models/Scheduling.ts`:
   - Adicionar `reminderSentAt?: string | null` em `SchedulingDTO`.
2. Atualizar interface `src/repositories/scheduling/ISchedulingRepository.ts`:
   - Adicionar assinaturas dos 3 novos métodos.
3. Implementar em `src/repositories/scheduling/MySqlSchedulingRepository.ts` (Knex):
   - `listFromNowWithinMinutes(offsetMinutes)`:
     - WHERE `date` BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL offsetMinutes MINUTE)
   - `listScheduledInMinutes(offsetMinutes)`:
     - WHERE `date` BETWEEN DATE_ADD(NOW(), INTERVAL (offset-5) MINUTE) AND DATE_ADD(NOW(), INTERVAL (offset+5) MINUTE)
   - `listUpcoming(windowMinutes)`:
     - WHERE `date` BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL windowMinutes MINUTE)
     - AND `reminder_sent_at IS NULL`
   - Manter formatação de datas com `DATE_FORMAT(..., '%Y-%m-%dT%H:%i')` quando precisar retornar string.
4. Migração SQL:
   - Criar migration Knex em `src/database/migrations/` adicionando coluna `reminder_sent_at DATETIME NULL`.

## Testes unitários
1. Atualizar mock `src/repositories/_mocks/SchedulingRepositoryMock.ts`:
   - Adicionar `listFromNowWithinMinutes`, `listScheduledInMinutes`, `listUpcoming` como `jest.fn()`.
2. Testes no nível de resolvers (task 08):
   - `AfterAppointmentAudienceResolver` usa `listFromNowWithinMinutes`.
   - `BeforeAppointmentAudienceResolver` usa `listScheduledInMinutes`.
3. (Opcional) Teste unitário de repositório é difícil sem DB.

## Critérios de aceite
- Métodos novos existem na interface, mocks e implementação.
- Migration adiciona coluna sem quebrar código existente.
