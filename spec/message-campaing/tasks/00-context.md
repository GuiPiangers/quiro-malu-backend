# Contexto compartilhado — Message Campaign (para LLMs)

Este arquivo existe para que as tasks em `spec/message-campaing/tasks/` sejam executáveis por LLMs **sem depender** de ler o spec inteiro de uma vez.

## Como usar
- Antes de executar qualquer task, ler este arquivo.
- Para requisitos detalhados, ler apenas as seções relevantes em `spec/message-campaing/message.spec.md`.

## Fonte de verdade
- Especificação completa: `spec/message-campaing/message.spec.md`
- Código existente (pontos principais):
  - `src/core/messageCampaign/models/MessageCampaign.ts`
  - `src/core/messageCampaign/models/Trigger.ts`
  - `src/core/messageCampaign/useCases/sendMessage/sendMessageUseCase.ts`
  - `src/repositories/queueProvider/sendMessageQueue/sendMessageQueue.ts`

## Interfaces (contratos) a implementar/usar

### WhatsApp provider
```ts
export interface SendMessageParams {
  to: string;   // internacional sem "+": "5551999999999"
  body: string; // template já renderizado
}

export interface SendMessageResult {
  success: boolean;
  providerMessageId?: string;
  errorMessage?: string;
}

export interface IWhatsAppProvider {
  sendMessage(params: SendMessageParams): Promise<SendMessageResult>;
}
```

### MessageLog
```ts
export type MessageOrigin = 'BIRTHDAY' | 'APPOINTMENT_REMINDER' | 'CAMPAIGN';
export type MessageStatus = 'SENT' | 'FAILED';

export interface MessageLogDTO {
  _id?: string;
  patientId: string;
  patientPhone: string;
  campaignId: string;
  origin: MessageOrigin;
  schedulingId?: string;
  renderedBody: string;
  status: MessageStatus;
  providerMessageId?: string;
  errorMessage?: string;
  sentAt?: Date;
  createdAt?: Date;
}

export interface IMessageLogRepository {
  save(log: MessageLogDTO): Promise<void>;
  saveMany(logs: MessageLogDTO[]): Promise<void>;

  getByPatient(
    patientId: string,
    config: { limit: number; offSet: number },
  ): Promise<MessageLogDTO[]>;

  getByCampaign(campaignId: string): Promise<MessageLogDTO[]>;

  countByCampaign(campaignId: string): Promise<{ sent: number; failed: number }>;

  existsBySchedulingAndCampaign(
    schedulingId: string,
    campaignId: string,
  ): Promise<boolean>;
}
```

### BirthdayMessageConfig (singleton)
```ts
export interface BirthdayMessageConfigDTO {
  _id?: string;
  campaignId: string;
  sendHour: number;   // 0–23
  sendMinute: number; // 0–59
}

export interface IBirthdayMessageConfigRepository {
  get(): Promise<BirthdayMessageConfigDTO | null>;
  save(config: BirthdayMessageConfigDTO): Promise<void>; // upsert
}
```

### Audience resolvers (campanhas agendadas)
```ts
export type CampaignAudienceType =
  | 'MOST_RECENT'
  | 'MOST_FREQUENT'
  | 'AFTER_APPOINTMENT'
  | 'BEFORE_APPOINTMENT'
  | 'SPECIFIC_PATIENTS';

export interface IAudienceResolver {
  resolve(campaign: MessageCampaignDTO): Promise<PatientDTO[]>;
}
```

### MessageCampaignDTO (campos novos)
Os campos abaixo são **adicionais** aos existentes (`id`, `name`, `templateMessage`, `active`, `initialDate`, `endDate`, `triggers`).

```ts
export type MessageCampaignStatus = 'DRAFT' | 'SCHEDULED' | 'PROCESSING' | 'DONE' | 'FAILED';

export type MessageCampaignDTO = {
  // ...campos já existentes

  // audiência (para campanhas agendadas)
  audienceType?: CampaignAudienceType;
  audienceLimit?: number;          // max 100
  audienceOffsetMinutes?: number;  // AFTER/BEFORE_APPOINTMENT
  audiencePatientIds?: string;     // JSON.stringify(string[]) para SPECIFIC_PATIENTS

  // execução
  status?: MessageCampaignStatus;
  scheduledAt?: Date;
  lastDispatchAt?: Date;
  lastDispatchCount?: number;
};
```

### Repositórios existentes (extensões)

#### IMessageCampaignRepository (novos métodos do spec)
Observação: hoje existe `get({ userId, id })` e `count(): number`. O spec propõe `getById`, `update`, `listScheduledUntil`.

```ts
export interface IMessageCampaignRepository {
  // existentes
  create(data: MessageCampaignDTO & { userId: string }): Promise<void>;
  listAll(): Promise<MessageCampaignDTO[]>;

  // novos
  getById(id: string): Promise<MessageCampaignDTO | null>;
  update(id: string, data: Partial<MessageCampaignDTO>): Promise<void>;
  listScheduledUntil(date: Date): Promise<MessageCampaignDTO[]>;
}
```

#### IPatientRepository (novos métodos do spec)
```ts
export interface IPatientRepository {
  getMostRecent(limit: number): Promise<PatientDTO[]>;
  getMostFrequent(limit: number): Promise<PatientDTO[]>;
}
```

#### ISchedulingRepository (novos métodos do spec)
```ts
export interface ISchedulingRepository {
  listFromNowWithinMinutes(offsetMinutes: number): Promise<Scheduling[]>;
  listScheduledInMinutes(offsetMinutes: number): Promise<Scheduling[]>;
  listUpcoming(windowMinutes: number): Promise<Scheduling[]>;
}
```

## Payload do job de envio (BullMQ)
No código atual existe `SendMessageQueuePrams` em `src/repositories/queueProvider/sendMessageQueue/sendMessageQueue.ts`.
O spec evolui isso adicionando `origin` e removendo dependências de notificação interna.

Recomendação (alvo do spec):
```ts
export type SendMessageJob = {
  userId: string;
  patientId: string;
  schedulingId?: string;
  messageCampaign: MessageCampaignDTO;
  origin: MessageOrigin;
};
```

## Regras de testes (padrão do repo)
- Testes unitários: `*.spec.ts` e ficam colocalizados:
  - use cases: `src/core/<module>/useCases/<useCase>/tests/*.spec.ts` (ou junto do use case se já é assim no módulo)
  - entities/models: `src/core/<module>/models/tests/*.spec.ts`
- Mocks: `src/repositories/_mocks/*Mock.ts` com `createMockX()` retornando `jest.fn()`.

