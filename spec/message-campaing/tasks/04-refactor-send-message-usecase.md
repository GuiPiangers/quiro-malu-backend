# Task 04 — Refatorar SendMessageUseCase (WhatsApp Provider + MessageLog)

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Corrigir o `SendMessageUseCase` para:
1) enviar mensagem via `IWhatsAppProvider` (Evolution API)
2) registrar resultado em `IMessageLogRepository`
3) manter `replaceVariables` / `extractVariables` exatamente como estão.

## Contexto (estado atual)
- Arquivo atual: `src/core/messageCampaign/useCases/sendMessage/sendMessageUseCase.ts`
- Hoje ele cria `NotificationSendMessage` e chama `sendAndSaveNotificationUseCase`, o que **não** envia WhatsApp.

## Implementação (passo a passo)
1. Ajustar o construtor do `SendMessageUseCase` para receber:
   - `IPatientRepository`
   - `ISchedulingRepository`
   - `IWhatsAppProvider`
   - `IMessageLogRepository`
2. Atualizar `execute(...)` para receber também `origin` (ex.: `'BIRTHDAY' | 'APPOINTMENT_REMINDER' | 'CAMPAIGN'`).
3. Fluxo:
   - Buscar paciente (`patientRepository.getById(patientId, userId)`)
   - Se não existir telefone, registrar falha no log (ou lançar `ApiError` dependendo da regra de negócio).
   - Se houver `schedulingId`, buscar scheduling (`schedulingRepository.get({ id, userId })`).
   - Renderizar `renderedBody` usando `replaceVariables` (não alterar regex/dicionário).
   - Enviar via `whatsAppProvider.sendMessage({ to: new Phone(patient.phone).formatted, body: renderedBody })`.
   - Persistir `MessageLog` com status `SENT|FAILED` e `providerMessageId/errorMessage`.

## Testes unitários
Atualizar o teste existente (ele hoje valida notificação interna).

1. Atualizar `src/core/messageCampaign/useCases/sendMessage/sendMessage.spec.ts` para:
   - Mockar `IWhatsAppProvider`.
   - Mockar `IMessageLogRepository`.
   - Manter mocks de `patientRepository` e `schedulingRepository` (já existem em `src/repositories/_mocks`).
2. Criar mocks seguindo padrão do projeto:
   - `src/providers/whatsapp/_mocks/WhatsAppProviderMock.ts` com `createMockWhatsAppProvider()`.
   - `src/repositories/_mocks/MessageLogRepositoryMock.ts` (se não existir) com `createMockMessageLogRepository()`.
3. Casos de teste mínimos:
   - Deve buscar paciente pelo `patientId` e `userId`.
   - Deve buscar scheduling apenas quando `schedulingId` é passado.
   - Deve chamar `whatsAppProvider.sendMessage` com telefone formatado e body renderizado.
   - Deve salvar `MessageLog` com `status: 'SENT'` quando provider retornar `success: true`.
   - Deve salvar `MessageLog` com `status: 'FAILED'` quando provider retornar `success: false`.
   - Deve manter a substituição de variáveis (ex.: `{{nome_paciente}}`).

## Critérios de aceite
- Não existe mais dependência de `NotificationSendMessage`/`sendAndSaveNotificationUseCase` no fluxo.
- `SendMessageUseCase` é testado com mocks e cobre sucesso e falha.
