# Task 06 — Deduplicação de listeners (WatchMessageTriggersUseCase)

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Evitar listeners duplicados no `appEventListener` quando `WatchMessageTriggersUseCase.execute()` for chamado mais de uma vez.

## Contexto (estado atual)
- Arquivo: `src/core/messageCampaign/useCases/watchMessageTriggers/watchMessageTriggersUseCase.ts`
- Hoje ele itera `listAll()` e sempre chama `new MessageCampaign(dto).watchTriggers()`.
- Isso pode duplicar listeners e enviar mensagens múltiplas vezes.

## Implementação (passo a passo)
1. Adicionar um controle em memória (ex.: `private registeredCampaigns = new Set<string>()`).
2. Em `execute()`:
   - para cada `messageCampaignDTO`, se `id` já estiver no Set, ignorar.
   - caso contrário, chamar `watchTriggers()` e adicionar o `id` no Set.
3. Garantir que `id` ausente não quebre o fluxo (validar DTO ou lançar `ApiError`).

## Testes unitários
1. Criar `src/core/messageCampaign/useCases/watchMessageTriggers/watchMessageTriggers.spec.ts`.
2. Criar mock do repositório:
   - `src/repositories/_mocks/MessageCampaignRepositoryMock.ts` (se não existir) com `listAll: jest.fn()`.
3. Mockar `MessageCampaign` para capturar chamadas de `watchTriggers()`:
   - `jest.mock("../../models/MessageCampaign", () => ({ MessageCampaign: jest.fn().mockImplementation(() => ({ watchTriggers: jest.fn() })) }))`
4. Casos mínimos:
   - Ao executar 2 vezes com os mesmos DTOs, `watchTriggers()` deve ser chamado apenas 1 vez por `campaignId`.
   - Quando `listAll()` retornar campanhas diferentes, deve registrar ambas.

## Critérios de aceite
- `WatchMessageTriggersUseCase` não duplica listeners ao reiniciar/rodar novamente.
- Testes cobrem o cenário de execução repetida.
