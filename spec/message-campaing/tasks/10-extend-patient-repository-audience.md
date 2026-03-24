# Task 10 — Extender IPatientRepository (audience: most recent / most frequent)

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Adicionar métodos no `IPatientRepository` para suportar resolvers de audiência:
- `getMostRecent(limit)`
- `getMostFrequent(limit)`

## Implementação (passo a passo)
1. Atualizar interface `src/repositories/patient/IPatientRepository.ts`:
   - Adicionar assinaturas conforme o spec.
2. Implementar em `src/repositories/patient/KnexPatientRepository.ts`:
   - `getMostRecent(limit)`:
     - `SELECT * FROM patients WHERE userId = ? ORDER BY created_at DESC LIMIT ?`
     - Garantir `limit <= 100`.
   - `getMostFrequent(limit)`:
     - JOIN com schedulings/schedules (alinhar com nome real da tabela no projeto).
     - GROUP BY patientId
     - ORDER BY COUNT(*) DESC
     - LIMIT `limit <= 100`.
3. Atualizar mocks:
   - `src/repositories/_mocks/PatientRepositoryMock.ts` deve incluir `getMostRecent` e `getMostFrequent` como `jest.fn()`.

## Testes unitários
1. No nível de use case/resolver:
   - Garantir que `MostRecentAudienceResolver` chama `getMostRecent` com `min(limit, 100)`.
   - Garantir que `MostFrequentAudienceResolver` chama `getMostFrequent` com `min(limit, 100)`.
2. (Opcional) Teste unitário do repositório com Knex é difícil sem DB.
   - Preferir testes de integração se existir infra de DB em CI.

## Critérios de aceite
- Interface e mock atualizados sem quebrar compilação.
- Resolvers (task 08) conseguem usar esses métodos.
