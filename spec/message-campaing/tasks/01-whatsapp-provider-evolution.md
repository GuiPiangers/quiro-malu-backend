# Task 01 — Provedor de WhatsApp (Evolution API)

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Implementar o provedor desacoplado de WhatsApp para que o envio real de mensagens seja feito via HTTP para a Evolution API, seguindo o contrato `IWhatsAppProvider` do spec.

## Escopo
- Criar interface `IWhatsAppProvider` e tipos (`SendMessageParams`, `SendMessageResult`).
- Criar implementação `EvolutionWhatsAppProvider` responsável por chamar `POST /message/sendText/{instance}`.
- Garantir que o provedor **não** dependa de controllers/use cases e possa ser injetado em `SendMessageUseCase`.

## Implementação (passo a passo)
1. Criar pasta `src/providers/whatsapp/`.
2. Criar `src/providers/whatsapp/IWhatsAppProvider.ts` com os tipos do spec.
3. Criar `src/providers/whatsapp/EvolutionWhatsAppProvider.ts`:
   - Receber no construtor: `baseUrl`, `apiKey`, `instance`.
   - Implementar `sendMessage({ to, body })`:
     - Fazer `fetch` (ou `axios`, padrão do projeto) para `${baseUrl}/message/sendText/${instance}`.
     - Headers: `Content-Type: application/json`, `apikey: apiKey`.
     - Body: `{ number: to, text: body }`.
     - Em erro HTTP: retornar `{ success: false, errorMessage }`.
     - Em sucesso: retornar `{ success: true, providerMessageId }`.
4. Adicionar variáveis em `.env.sample` (se ainda não existirem):
   - `EVOLUTION_API_BASE_URL`
   - `EVOLUTION_API_KEY`
   - `EVOLUTION_API_INSTANCE`

## Testes unitários
Criar testes focados apenas no provedor (sem subir servidor):

1. Criar mock de HTTP:
   - Se usar `axios`, mockar com `jest.mock("axios")`.
   - Se usar `fetch`, mockar `global.fetch`.
2. Criar arquivo de teste: `src/providers/whatsapp/tests/EvolutionWhatsAppProvider.spec.ts`.
3. Casos mínimos:
   - Deve retornar `success: true` e capturar `providerMessageId` quando a API retorna 2xx.
   - Deve retornar `success: false` quando `response.ok === false` (ou status >= 400), preenchendo `errorMessage`.
   - Deve retornar `success: false` quando ocorrer erro de rede/exception.

## Critérios de aceite
- `EvolutionWhatsAppProvider.sendMessage` nunca lança erro para fora; sempre retorna `SendMessageResult`.
- O contrato `IWhatsAppProvider` está isolado e pronto para ser injetado no `SendMessageUseCase`.
