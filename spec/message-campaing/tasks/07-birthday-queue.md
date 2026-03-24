# Task 07 — birthdayQueue (cron configurável) + enfileirar envios

> Antes de começar: leia `spec/message-campaing/tasks/00-context.md` e as seções relevantes em `spec/message-campaing/message.spec.md`.

> Interfaces relevantes: ver `spec/message-campaing/tasks/00-context.md`.


## Objetivo
Implementar o fluxo de mensagens de aniversário conforme o spec:
- Ler `BirthdayMessageConfig` (hora/minuto + campanha)
- Executar cron diário
- Buscar pacientes aniversariantes do dia
- Enfileirar jobs na `sendMessageQueue` com `origin: 'BIRTHDAY'`

## Contexto (estado atual)
- Existe `src/repositories/queueProvider/patientBirthDay/patientsBirthDayQueue.ts`.
- Hoje ele roda cron fixo (`0 0 5 * * *`) e emite evento `patientBirthDay`.

## Implementação (passo a passo)
1. Criar/atualizar uma fila dedicada (sugestão de path):
   - `src/queues/birthday/BirthdayQueue.ts` (ou adaptar a classe existente em `queueProvider/patientBirthDay`).
2. Alterar para usar `BirthdayMessageConfig`:
   - `config = birthdayMessageConfigRepository.get()`
   - Se não existir config, não faz nada.
3. Carregar campanha:
   - `campaign = messageCampaignRepository.getById(config.campaignId)` (criar método caso não exista).
   - Se campanha não existir ou `active === false`, não faz nada.
4. Cron dinâmico:
   - Converter `sendHour/sendMinute` para pattern (ex.: `"0 0 9 * * *"`).
   - Usar `QueueProvider.repeat(...)` com `jobId` fixo.
5. Processamento:
   - Obter `today = DateTime.now().date`.
   - `patients = patientRepository.getByDateOfBirth({ dateOfBirth: today })`.
   - Para cada paciente, enfileirar na `sendMessageQueue.add({ patientId, userId, messageCampaign: campaign, origin: 'BIRTHDAY' })`.

## Testes unitários
1. Criar teste unitário para a fila/classe:
   - `src/queues/birthday/tests/BirthdayQueue.spec.ts` (ou equivalente no local escolhido).
2. Mocks necessários:
   - `IBirthdayMessageConfigRepository` (mock task 03)
   - `IMessageCampaignRepository` (mock existente ou novo)
   - `IPatientRepository` (mock existente)
   - `sendMessageQueue` (mock com `add: jest.fn()`)
   - `IQueueProvider.repeat/process` (mock)
3. Casos mínimos:
   - Sem config → não chama `repeat`/não processa.
   - Config existe, campanha inativa → não enfileira.
   - Campanha ativa → chama `getByDateOfBirth` e enfileira 1 job por paciente.
   - Cron pattern gerado corretamente a partir de `sendHour/sendMinute`.

## Critérios de aceite
- O cron não é hardcoded; vem do BirthdayMessageConfig.
- Não há emissão de evento para disparar envio; o fluxo enfileira diretamente na `sendMessageQueue`.
