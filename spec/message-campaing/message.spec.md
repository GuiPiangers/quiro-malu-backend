## 1. Visão Geral

Este módulo é responsável por todo o ciclo de vida de envio de mensagens WhatsApp da clínica, cobrindo três grandes casos de uso:

| Caso de Uso | Trigger | Audiência |
|---|---|---|
| **Lembrete de Agendamento** | 2 horas antes do horário | Paciente do agendamento |
| **Mensagem de Aniversário** | Cron diário — horário configurável | Pacientes aniversariantes do dia |
| **Campanha** | Data/hora futura agendada | Segmento configurado |

### Princípios da arquitetura

- **Triggers por evento** — o sistema escuta eventos da aplicação (`createPatient`, `createSchedule`, `patientBirthDay`, etc.) e reage com os `Triggers` configurados em cada campanha.
- **Delay via BullMQ** — todo envio com atraso calculado é enfileirado no BullMQ com `delay` em milissegundos. Nunca via `setTimeout`.
- **Provedor desacoplado** — toda comunicação com WhatsApp passa por `IWhatsAppProvider`. Trocar de provedor é só criar uma nova implementação.
- **Templates editáveis** — o campo `templateMessage` da campanha usa variáveis `{{variavel}}`. O `SendMessageUseCase` já implementa a substituição.
- **Rastreabilidade completa** — cada mensagem enviada ou falhada é registrada em `MessageLog`.

---

## 2. Análise do Código Existente

### O que está correto e deve ser mantido

#### `Trigger.ts` — Hierarquia de triggers
A hierarquia `TriggerBase → TriggerWithDelay | TriggerWithStaticDate | TriggerWithDynamicDate` é sólida e deve ser mantida integralmente.

O método `calculateDelay` em `TriggerBase` tem lógica correta: calcula a diferença entre a data-alvo e agora em milissegundos, retornando 0 se o resultado for negativo. Os subtipos sobrescrevem o método para aplicar os offsets corretos.

**Unidade de delay:** A configuração `TriggerWithDelay` usa `delayUnit: "minutes" | "hours" | "days"` e converte tudo para minutos antes de chamar `super.calculateDelay`. O spec adota **minutos** como unidade interna padrão. O retorno de `calculateDelay` continua sendo **milissegundos** para o BullMQ.

```typescript
// Conversão interna — TriggerWithDelay (manter como está)
const minutesConverterTable = {
  minutes: 1,
  hours: 60,
  days: 60 * 24,
};
// O delay final passado ao BullMQ é sempre em milissegundos (retorno de calculateDelay)
```

#### `TriggerFactory.ts` — Correto
A factory que mapeia eventos para tipos de trigger está correta. Apenas adicionar novos eventos quando necessário.

#### `MessageCampaign.ts` — Correto com ressalvas
A lógica de `watchTriggers` que escuta eventos e emite `watchTriggers` é a fundação correta do sistema. Manter a estrutura, corrigir os pontos listados abaixo.

#### `SendMessageUseCase.ts` — `replaceVariables` correto
O método `replaceVariables` e `extractVariables` com regex `\{\{.*?\}\}` está correto e deve ser mantido. O dicionário de variáveis já cobre os casos necessários.

#### `WatchMessageTriggersUseCase.ts` — Correto
A estratégia de carregar todas as campanhas ativas na inicialização do servidor e registrar os listeners é a abordagem certa.

---

### O que deve ser alterado ou corrigido

#### Problema 1 — `SendMessageUseCase` usa sistema de notificação interno
**Situação atual:** O `SendMessageUseCase` cria um `NotificationSendMessage` e chama `sendAndSaveNotificationUseCase`. Isso não envia WhatsApp — delega para um sistema interno de notificações.

**Correção:** O `SendMessageUseCase` deve chamar diretamente o `IWhatsAppProvider` para enviar via Evolution API e registrar o resultado no `IMessageLogRepository`.

#### Problema 2 — Ausência de BullMQ no fluxo de envio com delay
**Situação atual:** Quando um trigger com delay é disparado (ex: `createSchedule` com delay de 120 minutos), o `watchTriggers` emite o evento `watchTriggers` imediatamente, sem agendar o delay no BullMQ.

**Correção:** O handler do `watchTriggers` deve enfileirar um job no BullMQ com o `delay` calculado pelo trigger, em vez de executar o envio diretamente.

#### Problema 3 — `watchTriggers` acumula listeners duplicados
**Situação atual:** Toda vez que `watchTriggers()` é chamado, novos listeners são adicionados no `appEventListener`. Se `WatchMessageTriggersUseCase` rodar mais de uma vez (ex: reinicialização), os listeners se duplicam e a mesma mensagem é enviada múltiplas vezes.

**Correção:** Antes de registrar os listeners, verificar por um Map de controle por `campaignId`.

#### Problema 4 — `MessageCampaignDTO` não tem campos de audiência
**Situação atual:** O `MessageCampaignDTO` não tem os campos de audiência (`audienceType`, `audienceLimit`, etc.) necessários para campanhas com critérios de segmentação agendadas.

**Correção:** Adicionar os campos de audiência ao `MessageCampaignDTO`.

---

### O que ainda precisa ser implementado

| Item | Status |
|---|---|
| `IWhatsAppProvider` + `EvolutionWhatsAppProvider` | Não implementado |
| `IMessageLogRepository` + schema Mongoose | Não implementado |
| `BirthdayQueue` (BullMQ) | Não implementado |
| `AppointmentReminderQueue` (BullMQ) | Não implementado |
| `CampaignDispatchQueue` (BullMQ) | Não implementado |
| `sendMessageQueue` (fila central) | Não implementado |
| `AudienceResolverFactory` + resolvers | Não implementado |
| Integração BullMQ no handler `watchTriggers` | Não implementado |
| `MessageLog` — entidade e repositório | Não implementado |
| `BirthdayMessageConfig` — configuração de horário | Não implementado |

---

## 3. Provedor de WhatsApp — Evolution API

### Como funciona

A aplicação Express **não instala nenhuma biblioteca do WhatsApp**. Ela apenas faz requisições HTTP para a instância da Evolution API, hospedada em servidor separado via Docker.

```
Aplicação Express
        │
        │  HTTP POST /message/sendText/{instance}
        ▼
  Evolution API  (Docker separado)
        │
        │  Protocolo WhatsApp Web (Baileys)
        ▼
     WhatsApp
```

### Interface e implementação

```typescript
// src/providers/whatsapp/IWhatsAppProvider.ts

export interface SendMessageParams {
  to: string;   // Formato internacional sem "+": "5551999999999"
  body: string; // Mensagem já renderizada com variáveis substituídas
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

```typescript
// src/providers/whatsapp/EvolutionWhatsAppProvider.ts

export class EvolutionWhatsAppProvider implements IWhatsAppProvider {
  constructor(
    private readonly baseUrl: string,   // Ex: "http://localhost:8080"
    private readonly apiKey: string,
    private readonly instance: string,  // Nome da instância na Evolution
  ) {}

  async sendMessage({ to, body }: SendMessageParams): Promise<SendMessageResult> {
    try {
      const response = await fetch(
        `${this.baseUrl}/message/sendText/${this.instance}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.apiKey,
          },
          body: JSON.stringify({ number: to, text: body }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return { success: false, errorMessage: error.message ?? 'Unknown error' };
      }

      const data = await response.json();
      return { success: true, providerMessageId: data.key?.id };
    } catch (err) {
      return { success: false, errorMessage: (err as Error).message };
    }
  }
}
```

> Para migrar para Meta Cloud API no futuro, basta criar `MetaWhatsAppProvider implements IWhatsAppProvider` e trocar a injeção de dependência. Nenhuma outra camada muda.

---

## 4. Banco de Dados

| Entidade | Banco | Justificativa |
|---|---|---|
| `MessageCampaign` | **MySQL** | Já em uso, relacional com pacientes e agendamentos |
| `MessageLog` | **MongoDB** | Alto volume, schema variável por provedor |
| `BirthdayMessageConfig` | **MongoDB** | Documento singleton de configuração |

> O `templateMessage` fica diretamente na `MessageCampaign` (como já está), não em uma entidade separada. Adequado para o escopo atual de single-tenant.

---

## 5. Entidades

### 5.1 `MessageCampaign` — Atualizada

Manter a estrutura existente e adicionar os campos de audiência para campanhas com critérios de segmentação.

```typescript
// src/core/messaging/models/MessageCampaign.ts

export type CampaignAudienceType =
  | 'MOST_RECENT'         // X pacientes mais recentes (máx 100)
  | 'MOST_FREQUENT'       // X pacientes com maior frequência (máx 100)
  | 'AFTER_APPOINTMENT'   // X minutos depois de um agendamento
  | 'BEFORE_APPOINTMENT'  // X minutos antes de um agendamento
  | 'SPECIFIC_PATIENTS';  // Lista de IDs específicos (máx 100)

export type MessageCampaignDTO = {
  id?: string;
  name: string;
  templateMessage: string;  // Ex: "Olá {{nome_paciente}}, ..."
  active: boolean;
  initialDate?: string;
  endDate?: string;
  triggers: TriggerDTO<any>[];

  // Campos de audiência — necessários apenas para campanhas agendadas
  audienceType?: CampaignAudienceType;
  audienceLimit?: number;          // MOST_RECENT | MOST_FREQUENT (máx 100)
  audienceOffsetMinutes?: number;  // AFTER/BEFORE_APPOINTMENT em minutos
  audiencePatientIds?: string;     // JSON.stringify(string[]) para SPECIFIC_PATIENTS

  // Campos de controle de execução
  status?: 'DRAFT' | 'SCHEDULED' | 'PROCESSING' | 'DONE' | 'FAILED';
  scheduledAt?: Date;
  lastDispatchAt?: Date;
  lastDispatchCount?: number;
};
```

**Variáveis de template disponíveis:**

| Variável | Descrição |
|---|---|
| `{{nome_paciente}}` | Nome completo do paciente |
| `{{telefone_paciente}}` | Telefone do paciente |
| `{{genero_paciente}}` | Gênero do paciente |
| `{{data_consulta}}` | Data e hora do agendamento |
| `{{servico_consulta}}` | Serviço do agendamento |
| `{{status_consulta}}` | Status do agendamento |

---

### 5.2 `Trigger.ts` — Manter com documentação dos tipos de evento

A hierarquia existente está correta. Mapeamento de eventos por classe:

| Classe | Eventos compatíveis | Comportamento |
|---|---|---|
| `TriggerWithDelay` | `createPatient`, `createSchedule` | Envia após delay configurado em minutos/horas/dias |
| `TriggerWithDynamicDate` | `patientBirthDay` | Envia no horário do evento (data vem no payload) |
| `TriggerWithStaticDate` | `updatePatient`, `updateSchedule` | Envia em data/hora fixa configurada |

O `calculateDelay` retorna **milissegundos** em todos os casos — este valor é passado diretamente ao campo `delay` do job BullMQ.

---

### 5.3 `MessageLog` — MongoDB

Registro individual de cada mensagem enviada ou falhada.

```typescript
// src/core/messaging/models/MessageLog.ts

export type MessageOrigin = 'BIRTHDAY' | 'APPOINTMENT_REMINDER' | 'CAMPAIGN';
export type MessageStatus  = 'SENT' | 'FAILED';

export interface MessageLogDTO {
  _id?: string;
  patientId: string;
  patientPhone: string;
  campaignId: string;              // ID da MessageCampaign
  origin: MessageOrigin;
  schedulingId?: string;           // Preenchido quando origin = APPOINTMENT_REMINDER
  renderedBody: string;            // Mensagem final após substituição de variáveis
  status: MessageStatus;
  providerMessageId?: string;      // ID retornado pela Evolution API
  errorMessage?: string;
  sentAt?: Date;
  createdAt?: Date;
}
```

**Mongoose Schema:**

```typescript
// src/infra/mongoose/schemas/MessageLogSchema.ts

import mongoose from 'mongoose';

const MessageLogSchema = new mongoose.Schema(
  {
    patientId:         { type: String, required: true, index: true },
    patientPhone:      { type: String, required: true },
    campaignId:        { type: String, required: true, index: true },
    origin:            { type: String, enum: ['BIRTHDAY','APPOINTMENT_REMINDER','CAMPAIGN'], required: true },
    schedulingId:      { type: String },
    renderedBody:      { type: String, required: true },
    status:            { type: String, enum: ['SENT','FAILED'], required: true },
    providerMessageId: { type: String },
    errorMessage:      { type: String },
    sentAt:            { type: Date },
  },
  { timestamps: true },
);

export const MessageLogModel = mongoose.model('MessageLog', MessageLogSchema);
```

---

### 5.4 `BirthdayMessageConfig` — MongoDB (singleton)

```typescript
// src/core/messaging/models/BirthdayMessageConfig.ts

export interface BirthdayMessageConfigDTO {
  _id?: string;
  campaignId: string;   // ID da MessageCampaign usada para aniversário
  sendHour: number;     // 0–23
  sendMinute: number;   // 0–59
}
```

```typescript
// Mongoose Schema — sempre upsert por ID fixo "birthday_config"
const BirthdayMessageConfigSchema = new mongoose.Schema({
  campaignId:  { type: String, required: true },
  sendHour:    { type: Number, required: true, min: 0, max: 23 },
  sendMinute:  { type: Number, required: true, min: 0, max: 59 },
});
```

---

## 6. Repositórios

### 6.1 `IMessageCampaignRepository` — Extensão

```typescript
// src/repositories/messageCampaign/IMessageCampaignRepository.ts

export interface IMessageCampaignRepository {
  // Métodos existentes
  create(data: MessageCampaignDTO & { userId: string }): Promise<void>;
  list(data: { userId: string; config: { limit: number; offSet: number } }): Promise<MessageCampaignDTO[]>;
  count(data: { userId: string }): Promise<[{ total: number }]>;
  listAll(): Promise<MessageCampaignDTO[]>;

  // Novos métodos
  getById(id: string): Promise<MessageCampaignDTO | null>;
  update(id: string, data: Partial<MessageCampaignDTO>): Promise<void>;

  /** Campanhas com status SCHEDULED e scheduledAt <= date */
  listScheduledUntil(date: Date): Promise<MessageCampaignDTO[]>;
}
```

---

### 6.2 `IMessageLogRepository`

```typescript
// src/repositories/messaging/IMessageLogRepository.ts

export interface IMessageLogRepository {
  save(log: MessageLogDTO): Promise<void>;
  saveMany(logs: MessageLogDTO[]): Promise<void>;

  /** Histórico de mensagens de um paciente específico */
  getByPatient(
    patientId: string,
    config: { limit: number; offSet: number },
  ): Promise<MessageLogDTO[]>;

  /** Todos os logs de uma campanha */
  getByCampaign(campaignId: string): Promise<MessageLogDTO[]>;

  /** Relatório resumido de uma campanha */
  countByCampaign(campaignId: string): Promise<{ sent: number; failed: number }>;

  /** Verifica se já foi enviado para este agendamento (evita duplicidade) */
  existsBySchedulingAndCampaign(schedulingId: string, campaignId: string): Promise<boolean>;
}
```

---

### 6.3 `IBirthdayMessageConfigRepository`

```typescript
// src/repositories/messaging/IBirthdayMessageConfigRepository.ts

export interface IBirthdayMessageConfigRepository {
  get(): Promise<BirthdayMessageConfigDTO | null>;
  save(config: BirthdayMessageConfigDTO): Promise<void>; // upsert
}
```

---

## 7. Interfaces de Serviço

### 7.1 `SendMessageUseCase` — Corrigido

Substituir `sendAndSaveNotificationUseCase` por `IWhatsAppProvider` + `IMessageLogRepository`.

```typescript
// src/core/messaging/useCases/sendMessage/sendMessageUseCase.ts

export class SendMessageUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private schedulingRepository: ISchedulingRepository,
    private whatsAppProvider: IWhatsAppProvider,           // substitui sendAndSaveNotification
    private messageLogRepository: IMessageLogRepository,   // novo
  ) {}

  async execute({
    userId,
    patientId,
    schedulingId,
    messageCampaign,
    origin,
  }: {
    userId: string;
    patientId: string;
    schedulingId?: string;
    messageCampaign: MessageCampaignDTO;
    origin: MessageOrigin;
  }) {
    try {
      const [patient] = await this.patientRepository.getById(patientId, userId);
      if (!patient?.phone) throw new Error(`Paciente ${patientId} sem telefone`);

      const [scheduling] = schedulingId
        ? await this.schedulingRepository.get({ id: schedulingId, userId })
        : [];

      // replaceVariables — manter lógica existente exatamente como está
      const renderedBody = this.replaceVariables(messageCampaign.templateMessage, {
        patient,
        scheduling,
      });

      const result = await this.whatsAppProvider.sendMessage({
        to: new Phone(patient.phone).formatted,
        body: renderedBody,
      });

      await this.messageLogRepository.save({
        patientId,
        patientPhone: patient.phone,
        campaignId: messageCampaign.id!,
        origin,
        schedulingId,
        renderedBody,
        status: result.success ? 'SENT' : 'FAILED',
        providerMessageId: result.providerMessageId,
        errorMessage: result.errorMessage,
        sentAt: result.success ? new Date() : undefined,
      });
    } catch (error: any) {
      console.error('[SendMessageUseCase]', error.message);
    }
  }

  // replaceVariables e extractVariables — manter exatamente como estão
}
```

---

### 7.2 `MessageCampaign.watchTriggers` — Corrigido

```typescript
// src/core/messaging/models/MessageCampaign.ts — watchTriggers corrigido

watchTriggers() {
  this.triggers.forEach((trigger) => {
    if (this.isPatientTrigger(trigger.event)) {
      appEventListener.on(trigger.event, async (data) => {
        const delay = trigger.calculateDelay({ date: DateTime.now() });

        // Enfileira no BullMQ com delay em milissegundos
        await sendMessageQueue.add({
          messageCampaign: this.getDTO(),
          patientId: data.patientId,
          userId: data.userId,
          origin: 'CAMPAIGN',
        }, { delay });
      });
    }

    if (this.isScheduleTrigger(trigger.event)) {
      appEventListener.on(trigger.event, async (data) => {
        const date = data.date ? new DateTime(data.date) : DateTime.now();
        const delay = trigger.calculateDelay({ date });

        await sendMessageQueue.add({
          messageCampaign: this.getDTO(),
          patientId: data.patientId,
          userId: data.userId,
          schedulingId: data.scheduleId,
          origin: 'APPOINTMENT_REMINDER',
        }, { delay });
      });
    }
  });
}
```

---

### 7.3 `WatchMessageTriggersUseCase` — Deduplicação

```typescript
// src/core/messaging/useCases/watchMessageTriggers/watchMessageTriggersUseCase.ts

export class WatchMessageTriggersUseCase {
  private registeredCampaigns = new Set<string>();

  constructor(private messageCampaignRepository: IMessageCampaignRepository) {}

  async execute() {
    const messagesCampaignsData = await this.messageCampaignRepository.listAll();

    messagesCampaignsData.forEach((messageCampaignDTO) => {
      if (this.registeredCampaigns.has(messageCampaignDTO.id!)) return;

      const messageCampaign = new MessageCampaign(messageCampaignDTO);
      messageCampaign.watchTriggers();
      this.registeredCampaigns.add(messageCampaignDTO.id!);
    });
  }
}
```

---

## 8. Audience Resolvers — Campanhas

Cada critério de audiência de campanha agendada tem uma implementação dedicada.

### Interface base

```typescript
// src/core/messaging/audience/IAudienceResolver.ts

export interface IAudienceResolver {
  resolve(campaign: MessageCampaignDTO): Promise<PatientDTO[]>;
}
```

### Factory

```typescript
// src/core/messaging/audience/AudienceResolverFactory.ts

export class AudienceResolverFactory {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly schedulingRepository: ISchedulingRepository,
  ) {}

  make(type: CampaignAudienceType): IAudienceResolver {
    switch (type) {
      case 'MOST_RECENT':
        return new MostRecentAudienceResolver(this.patientRepository);
      case 'MOST_FREQUENT':
        return new MostFrequentAudienceResolver(this.patientRepository);
      case 'AFTER_APPOINTMENT':
        return new AfterAppointmentAudienceResolver(this.schedulingRepository, this.patientRepository);
      case 'BEFORE_APPOINTMENT':
        return new BeforeAppointmentAudienceResolver(this.schedulingRepository, this.patientRepository);
      case 'SPECIFIC_PATIENTS':
        return new SpecificPatientsAudienceResolver(this.patientRepository);
    }
  }
}
```

### Implementações

```typescript
// MostRecentAudienceResolver
// ORDER BY created_at DESC LIMIT min(audienceLimit, 100)
resolve(campaign) {
  return this.patientRepository.getMostRecent(
    Math.min(campaign.audienceLimit ?? 100, 100)
  );
}

// MostFrequentAudienceResolver
// JOIN schedulings, GROUP BY patient_id, ORDER BY COUNT(*) DESC LIMIT min(audienceLimit, 100)
resolve(campaign) {
  return this.patientRepository.getMostFrequent(
    Math.min(campaign.audienceLimit ?? 100, 100)
  );
}

// AfterAppointmentAudienceResolver
// Agendamentos entre agora e agora + audienceOffsetMinutes
// WHERE date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL offsetMinutes MINUTE)
resolve(campaign) {
  return this.schedulingRepository
    .listFromNowWithinMinutes(campaign.audienceOffsetMinutes ?? 0)
    .then(schedulings => /* buscar pacientes pelos schedulings */);
}

// BeforeAppointmentAudienceResolver
// Agendamentos daqui a offsetMinutes com janela de ±5 min
// WHERE date BETWEEN DATE_ADD(NOW(), INTERVAL (offset-5) MINUTE)
//               AND DATE_ADD(NOW(), INTERVAL (offset+5) MINUTE)
resolve(campaign) {
  return this.schedulingRepository
    .listScheduledInMinutes(campaign.audienceOffsetMinutes ?? 0)
    .then(schedulings => /* buscar pacientes pelos schedulings */);
}

// SpecificPatientsAudienceResolver
// IDs deserializados do campo audiencePatientIds (máx 100)
resolve(campaign) {
  const ids: string[] = JSON.parse(campaign.audiencePatientIds ?? '[]');
  return Promise.all(
    ids.slice(0, 100).map(id => this.patientRepository.getById(id, /* userId */))
  ).then(results => results.flat().filter(Boolean) as PatientDTO[]);
}
```

---

## 9. Filas BullMQ

### Visão geral

| Fila | Trigger | Responsabilidade |
|---|---|---|
| `sendMessageQueue` | Evento + delay calculado | Envio individual para um paciente |
| `birthdayQueue` | Cron diário (hora configurável) | Busca aniversariantes e enfileira envios |
| `campaignDispatchQueue` | Cron a cada 1 min | Processa campanhas agendadas com audiência |

---

### 9.1 `sendMessageQueue` — Fila central de envio

Alimentada por todas as origens (trigger de evento, aniversário, campanha agendada).

```typescript
// src/queues/sendMessage/SendMessageQueue.ts

import { Queue, Worker } from 'bullmq';
import { redis } from '../redis';

export const sendMessageQueue = new Queue('sendMessage', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 1000, // manter últimas 1000 falhas para debug
  },
});

const worker = new Worker(
  'sendMessage',
  async (job) => {
    const { messageCampaign, patientId, userId, schedulingId, origin } = job.data;
    await sendMessageUseCase.execute({
      messageCampaign,
      patientId,
      userId,
      schedulingId,
      origin,
    });
  },
  {
    connection: redis,
    limiter: { max: 1, duration: 1000 }, // 1 mensagem por segundo — anti-ban
  },
);

worker.on('error', (err) => console.error('[sendMessageQueue]', err));
```

---

### 9.2 `birthdayQueue`

```typescript
// src/queues/birthday/BirthdayQueue.ts

// O cron pattern é gerado dinamicamente a partir do BirthdayMessageConfig
// Ex: sendHour=9, sendMinute=0 → pattern "0 0 9 * * *"

const worker = new Worker(
  'birthdayMessages',
  async () => {
    const config = await birthdayMessageConfigRepository.get();
    if (!config) return;

    const campaign = await messageCampaignRepository.getById(config.campaignId);
    if (!campaign?.active) return;

    const today = DateTime.now().date;
    const patients = await patientRepository.getByDateOfBirth({ dateOfBirth: today });

    for (const patient of patients) {
      await sendMessageQueue.add({
        messageCampaign: campaign,
        patientId: patient.id,
        userId: patient.userId,
        origin: 'BIRTHDAY',
      });
    }
  },
  { connection: redis },
);

// Chamar ao salvar novo BirthdayMessageConfig pelo painel
export async function updateBirthdayCron(config: BirthdayMessageConfigDTO) {
  await birthdayQueue.upsertJobScheduler(
    'birthdayMessages',
    { pattern: `0 ${config.sendMinute} ${config.sendHour} * * *` },
    { data: {} },
  );
}
```

---

### 9.3 `campaignDispatchQueue`

```typescript
// src/queues/campaignDispatch/CampaignDispatchQueue.ts

// Cron: "* * * * *" (a cada 1 minuto)

const worker = new Worker(
  'campaignDispatch',
  async () => {
    const campaigns = await messageCampaignRepository.listScheduledUntil(new Date());

    for (const campaign of campaigns) {
      // Marca como PROCESSING imediatamente para evitar reprocessamento paralelo
      await messageCampaignRepository.update(campaign.id!, { status: 'PROCESSING' });

      try {
        const resolver = audienceResolverFactory.make(campaign.audienceType!);
        const patients = await resolver.resolve(campaign);

        for (const patient of patients) {
          await sendMessageQueue.add({
            messageCampaign: campaign,
            patientId: patient.id,
            userId: patient.userId,
            origin: 'CAMPAIGN',
          });
        }

        await messageCampaignRepository.update(campaign.id!, {
          status: 'DONE',
          lastDispatchAt: new Date(),
          lastDispatchCount: patients.length,
        });
      } catch (err) {
        await messageCampaignRepository.update(campaign.id!, { status: 'FAILED' });
      }
    }
  },
  { connection: redis },
);
```

---

### Reenvio de campanha

```typescript
// Para reenviar uma campanha já concluída:
await messageCampaignRepository.update(id, {
  status: 'SCHEDULED',
  scheduledAt: novaData,
});
// O cron detecta automaticamente no próximo ciclo
```

---

## 10. Extensões em Repositórios Existentes

### `IPatientRepository` — novos métodos

```typescript
/** X pacientes com cadastro mais recente — ORDER BY created_at DESC LIMIT limit */
getMostRecent(limit: number): Promise<PatientDTO[]>;

/** X pacientes com maior número de agendamentos — JOIN schedulings, ORDER BY COUNT(*) DESC */
getMostFrequent(limit: number): Promise<PatientDTO[]>;
```

---

### `ISchedulingRepository` — novos métodos

```typescript
/**
 * Agendamentos entre agora e agora + offsetMinutes.
 * WHERE date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL offsetMinutes MINUTE)
 */
listFromNowWithinMinutes(offsetMinutes: number): Promise<Scheduling[]>;

/**
 * Agendamentos daqui a offsetMinutes (±5 min de janela de segurança).
 * WHERE date BETWEEN
 *   DATE_ADD(NOW(), INTERVAL (offsetMinutes - 5) MINUTE)
 *   AND DATE_ADD(NOW(), INTERVAL (offsetMinutes + 5) MINUTE)
 */
listScheduledInMinutes(offsetMinutes: number): Promise<Scheduling[]>;

/**
 * Agendamentos nas próximas windowMinutes onde reminder ainda não foi enviado.
 * WHERE date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL windowMinutes MINUTE)
 * AND reminder_sent_at IS NULL
 */
listUpcoming(windowMinutes: number): Promise<Scheduling[]>;
```

---

### `ISchedulingDTO` — novo campo

```typescript
reminderSentAt?: string | null; // Controle de lembrete já enviado
```

```sql
ALTER TABLE schedulings ADD COLUMN reminder_sent_at DATETIME NULL;
```

---

## 11. Estrutura de Pastas

```
src/
└── core/
    └── messaging/
        ├── models/
        │   ├── MessageCampaign.ts         ← existente — adicionar campos de audiência
        │   ├── Trigger.ts                 ← existente — manter
        │   ├── TriggerFactory.ts          ← existente — manter
        │   ├── MessageLog.ts              ← novo
        │   └── BirthdayMessageConfig.ts   ← novo
        │
        ├── audience/                      ← novo diretório
        │   ├── IAudienceResolver.ts
        │   ├── AudienceResolverFactory.ts
        │   ├── MostRecentAudienceResolver.ts
        │   ├── MostFrequentAudienceResolver.ts
        │   ├── AfterAppointmentAudienceResolver.ts
        │   ├── BeforeAppointmentAudienceResolver.ts
        │   └── SpecificPatientsAudienceResolver.ts
        │
        ├── controller/
        │   ├── createMessageCampaign/     ← existente
        │   └── listMessageCampaign/       ← existente
        │
        └── useCases/
            ├── createMessageCampaign/     ← existente
            ├── listMessageCampaign/       ← existente
            ├── sendMessage/               ← existente — refatorar provider
            └── watchMessageTriggers/      ← existente — adicionar deduplicação

src/
│
├── repositories/
│   └── messaging/
│       ├── IMessageLogRepository.ts       ← novo
│       └── IBirthdayMessageConfigRepository.ts ← novo
│   └── whatsapp/
│       ├── IWhatsAppProvider.ts           ← novo
│       └── EvolutionWhatsAppProvider.ts   ← novo
├── database/
│   └── mongoose/
│       └── schemas/
│           ├── MessageLogSchema.ts        ← novo
│           └── BirthdayMessageConfigSchema.ts ← novo
│
└── queues/
    ├── sendMessage/
    │   └── SendMessageQueue.ts            ← novo (fila central)
    ├── birthday/
    │   └── BirthdayQueue.ts               ← substituir implementação existente
    └── campaignDispatch/
        └── CampaignDispatchQueue.ts       ← novo
```

---

## 12. Fluxos Detalhados

### Fluxo 1 — Trigger por evento (createSchedule, createPatient, etc.)

```
App emite evento (ex: "createSchedule")
        │
        ▼
MessageCampaign.watchTriggers() escuta o evento
        │
        ▼
trigger.calculateDelay({ date }) → delay em milissegundos
        │
        ▼
sendMessageQueue.add({ patientId, campaignId, ... }, { delay })
        │   BullMQ aguarda o delay
        ▼
Worker sendMessageQueue processa o job
        │
        ├── patientRepository.getById(patientId)
        ├── schedulingRepository.get(schedulingId) [se houver]
        ├── replaceVariables(templateMessage, { patient, scheduling })
        ├── whatsAppProvider.sendMessage({ to, body })
        └── messageLogRepository.save({ status: SENT|FAILED, ... })
```

---

### Fluxo 2 — Lembrete 2 horas antes do agendamento

Este é um caso específico do Fluxo 1. A campanha de lembrete é configurada com:
- Evento: `createSchedule`
- Trigger: `TriggerWithDelay { delay: -120, delayUnit: "minutes" }`

O `calculateDelay` recebe a `date` do agendamento e aplica o offset negativo, resultando no delay correto para disparar 2h antes.

```
Clínica cria agendamento (14h00)
        │
        ▼
App emite "createSchedule" com { date: "2025-06-10T14:00:00" }
        │
        ▼
TriggerWithDelay.calculateDelay({ date: "14h00" })
  → delayInMinutes = -120
  → targetDate = 14h00 - 120min = 12h00
  → delay = (12h00 - agora) em ms
  → Ex: se agora são 8h00 → delay = 4h = 14.400.000 ms
        │
        ▼
sendMessageQueue.add({ ... }, { delay: 14_400_000 })
        │   BullMQ aguarda 4 horas
        ▼
Worker executa às 12h00 → sendMessage → WhatsApp
```

---

### Fluxo 3 — Mensagem de aniversário

```
[Cron — horário configurado no BirthdayMessageConfig]
        │
        ▼
birthdayMessageConfigRepository.get() → { campaignId, sendHour, sendMinute }
        │
        ▼
patientRepository.getByDateOfBirth(today)
        │
        ▼  Para cada paciente aniversariante
        │
        └── sendMessageQueue.add({ patientId, campaignId, origin: 'BIRTHDAY' })
                │  delay = 0 (envio imediato)
                ▼
            Worker sendMessageQueue
                ├── replaceVariables(templateMessage, { patient })
                ├── whatsAppProvider.sendMessage(...)
                └── messageLogRepository.save(...)
```

---

### Fluxo 4 — Campanha agendada com critério de audiência

```
[Cron a cada 1 min]
        │
        ▼
messageCampaignRepository.listScheduledUntil(now)
        │
        ▼  Para cada campanha SCHEDULED
        │
        ├── update(id, { status: 'PROCESSING' })
        ├── AudienceResolverFactory.make(audienceType).resolve(campaign)
        │       └── → PatientDTO[]
        │
        ├── Para cada paciente:
        │       └── sendMessageQueue.add({ patientId, campaignId, origin: 'CAMPAIGN' })
        │
        └── update(id, { status: 'DONE', lastDispatchAt, lastDispatchCount })
```

---

## 13. Variáveis de Ambiente

```env
# Evolution API
EVOLUTION_API_BASE_URL=http://localhost:8080
EVOLUTION_API_KEY=your-api-key-here
EVOLUTION_API_INSTANCE=clinica-quiropraxia

```
O resto já está configurado
---

## 14. Decisões de Design

### Unidade de offset — minutos

Minutos são a unidade interna padrão, alinhada com a implementação existente em `TriggerWithDelay`. O BullMQ recebe sempre **milissegundos** (retorno de `calculateDelay`). O frontend pode exibir "dias / horas / minutos" e converter antes de enviar para a API.

| Unidade visual | Conversão para minutos |
|---|---|
| 1 hora | 60 minutos |
| 1 dia | 1440 minutos |

---

### `sendMessageQueue` como fila central

Todas as origens (trigger de evento, aniversário, campanha agendada) enfileiram jobs na mesma `sendMessageQueue`. Isso garante:
- **Throttle unificado** — 1 msg/s independente da origem, sem risco de ban
- **Retry único** — qualquer falha é tratada no mesmo lugar
- **Sem duplicação de lógica** — `SendMessageUseCase` existe em um único lugar

---

### `templateMessage` na `MessageCampaign` (sem entidade separada)

Para o escopo atual (single-tenant, campanha simples), manter o template diretamente na campanha é mais simples e evita um repositório extra. Se no futuro for necessário reutilizar templates entre campanhas, a refatoração é direta.

---

### `audiencePatientIds` como TEXT (JSON serializado)

- Limite de 100 IDs por campanha
- Lista imutável após criação
- Sem necessidade de queries relacionais sobre os IDs
- Evita tabela extra para dado simples e estático

---

### Janela de ±5 minutos no `BeforeAppointmentAudienceResolver`

O cron roda a cada 1 minuto. Sem janela de segurança, um agendamento pode ser "pulado" se o ciclo demorar mais que o esperado. A janela de ±5 minutos garante que todos sejam capturados. Para evitar envio duplicado dentro da janela, verificar `MessageLog.existsBySchedulingAndCampaign` antes de enfileirar.

---

### MongoDB para `MessageLog`

- Volume potencialmente alto (1 documento por mensagem enviada)
- Schema pode variar por provedor no futuro (Evolution vs Meta retornam IDs em formatos diferentes)
- Queries de relatório são simples: count por status, filtro por paciente ou campanha
- Sem necessidade de joins com outras entidades