import { z } from "../../schemas/zodOpenApi";
import {
  CreateBirthdayMessageBodySchema,
  UpdateBirthdayMessageBodySchema,
} from "../../core/messages/controllers/birthdayMessageSchemas";
import {
  BindCampaignStrategiesBodySchema,
  CreateMessageSendStrategyBodySchema,
  UpdateMessageSendStrategyBodySchema,
} from "../../core/messages/controllers/messageSendStrategyHttpSchemas";
import {
  CampaignIdParamSchema,
  ListPageLimitQuerySchema,
  MessageEntityIdParamSchema,
  MessageResponseSchema,
  PatientIdParamSchema,
} from "../../core/messages/controllers/messagesCommonSchemas";
import {
  AfterScheduleMessageDtoSchema,
  AfterScheduledMessagesListResponseSchema,
  BeforeScheduleMessageDtoSchema,
  BeforeScheduleMessagesListResponseSchema,
  BirthdayMessageDtoSchema,
  BirthdayMessagesListResponseSchema,
  GetMessageSendStrategyResponseSchema,
  ListMessageSendStrategyResponseSchema,
  ListWhatsAppMessageLogsResponseSchema,
  MessageSendStrategyItemResponseSchema,
  WhatsAppMessageLogsSummaryResponseSchema,
} from "../../core/messages/controllers/messagesResponseSchemas";
import {
  CreateAfterScheduleMessageBodySchema,
  CreateBeforeScheduleMessageBodySchema,
  UpdateAfterScheduleMessageBodySchema,
  UpdateBeforeScheduleMessageBodySchema,
} from "../../core/messages/controllers/scheduledMessageSchemas";
import {
  GetWhatsAppMessageLogsSummaryQuerySchema,
  ListWhatsAppMessageLogsQuerySchema,
} from "../../core/messages/controllers/whatsAppMessageLogsSchemas";
import { openApiRegistry } from "../registry";

const bearer = [{ bearerAuth: [] }];

const MessageSendStrategyByCampaignListSchema = z
  .array(MessageSendStrategyItemResponseSchema)
  .openapi("MessageSendStrategyByCampaignList");

openApiRegistry.registerPath({
  method: "post",
  path: "/beforeScheduleMessages",
  tags: ["Messages"],
  summary: "Cria mensagem automática antes da consulta",
  security: bearer,
  request: {
    body: {
      content: { "application/json": { schema: CreateBeforeScheduleMessageBodySchema } },
    },
  },
  responses: {
    201: {
      description: "Criada",
      content: { "application/json": { schema: BeforeScheduleMessageDtoSchema } },
    },
    400: { description: "Corpo inválido (Zod) ou regra de negócio" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/beforeScheduleMessages",
  tags: ["Messages"],
  summary: "Lista mensagens antes da consulta (paginação)",
  security: bearer,
  request: { query: ListPageLimitQuerySchema },
  responses: {
    200: {
      description: "Lista",
      content: {
        "application/json": { schema: BeforeScheduleMessagesListResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/beforeScheduleMessages/{id}",
  tags: ["Messages"],
  summary: "Obtém mensagem antes da consulta por id",
  security: bearer,
  request: { params: MessageEntityIdParamSchema },
  responses: {
    200: {
      description: "Configuração",
      content: { "application/json": { schema: BeforeScheduleMessageDtoSchema } },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/beforeScheduleMessages/{id}",
  tags: ["Messages"],
  summary: "Atualiza mensagem antes da consulta",
  security: bearer,
  request: {
    params: MessageEntityIdParamSchema,
    body: {
      content: { "application/json": { schema: UpdateBeforeScheduleMessageBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Atualizada",
      content: { "application/json": { schema: BeforeScheduleMessageDtoSchema } },
    },
    400: { description: "Parâmetros/corpo inválidos (Zod) ou regra de negócio" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/beforeScheduleMessages/{id}",
  tags: ["Messages"],
  summary: "Remove mensagem antes da consulta",
  security: bearer,
  request: { params: MessageEntityIdParamSchema },
  responses: {
    200: {
      description: "Removida",
      content: { "application/json": { schema: MessageResponseSchema } },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/afterScheduleMessages",
  tags: ["Messages"],
  summary: "Cria mensagem automática após a consulta",
  security: bearer,
  request: {
    body: {
      content: { "application/json": { schema: CreateAfterScheduleMessageBodySchema } },
    },
  },
  responses: {
    201: {
      description: "Criada",
      content: { "application/json": { schema: AfterScheduleMessageDtoSchema } },
    },
    400: { description: "Corpo inválido (Zod) ou regra de negócio" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/afterScheduleMessages",
  tags: ["Messages"],
  summary: "Lista mensagens após a consulta (paginação)",
  security: bearer,
  request: { query: ListPageLimitQuerySchema },
  responses: {
    200: {
      description: "Lista",
      content: {
        "application/json": { schema: AfterScheduledMessagesListResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/afterScheduleMessages/{id}",
  tags: ["Messages"],
  summary: "Obtém mensagem após a consulta por id",
  security: bearer,
  request: { params: MessageEntityIdParamSchema },
  responses: {
    200: {
      description: "Configuração",
      content: { "application/json": { schema: AfterScheduleMessageDtoSchema } },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/afterScheduleMessages/{id}",
  tags: ["Messages"],
  summary: "Atualiza mensagem após a consulta",
  security: bearer,
  request: {
    params: MessageEntityIdParamSchema,
    body: {
      content: { "application/json": { schema: UpdateAfterScheduleMessageBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Atualizada",
      content: { "application/json": { schema: AfterScheduleMessageDtoSchema } },
    },
    400: { description: "Parâmetros/corpo inválidos (Zod) ou regra de negócio" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/afterScheduleMessages/{id}",
  tags: ["Messages"],
  summary: "Remove mensagem após a consulta",
  security: bearer,
  request: { params: MessageEntityIdParamSchema },
  responses: {
    200: {
      description: "Removida",
      content: { "application/json": { schema: MessageResponseSchema } },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/birthdayMessages",
  tags: ["Messages"],
  summary: "Cria mensagem de aniversário",
  security: bearer,
  request: {
    body: {
      content: { "application/json": { schema: CreateBirthdayMessageBodySchema } },
    },
  },
  responses: {
    201: {
      description: "Criada",
      content: { "application/json": { schema: BirthdayMessageDtoSchema } },
    },
    400: { description: "Corpo inválido (Zod) ou regra de negócio" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/birthdayMessages",
  tags: ["Messages"],
  summary: "Lista mensagens de aniversário (paginação)",
  security: bearer,
  request: { query: ListPageLimitQuerySchema },
  responses: {
    200: {
      description: "Lista",
      content: {
        "application/json": { schema: BirthdayMessagesListResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/birthdayMessages/{id}",
  tags: ["Messages"],
  summary: "Obtém mensagem de aniversário por id",
  security: bearer,
  request: { params: MessageEntityIdParamSchema },
  responses: {
    200: {
      description: "Configuração",
      content: { "application/json": { schema: BirthdayMessageDtoSchema } },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/birthdayMessages/{id}",
  tags: ["Messages"],
  summary: "Atualiza mensagem de aniversário",
  security: bearer,
  request: {
    params: MessageEntityIdParamSchema,
    body: {
      content: { "application/json": { schema: UpdateBirthdayMessageBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Atualizada",
      content: { "application/json": { schema: BirthdayMessageDtoSchema } },
    },
    400: { description: "Parâmetros/corpo inválidos (Zod) ou regra de negócio" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/birthdayMessages/{id}",
  tags: ["Messages"],
  summary: "Remove mensagem de aniversário",
  security: bearer,
  request: { params: MessageEntityIdParamSchema },
  responses: {
    200: {
      description: "Removida",
      content: { "application/json": { schema: MessageResponseSchema } },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/messageSendStrategies",
  tags: ["Messages"],
  summary: "Lista estratégias de envio (paginação; inclui estratégia virtual “Único por paciente”)",
  security: bearer,
  request: { query: ListPageLimitQuerySchema },
  responses: {
    200: {
      description: "Lista",
      content: {
        "application/json": { schema: ListMessageSendStrategyResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/messageSendStrategies/by-campaign/{campaignId}",
  tags: ["Messages"],
  summary: "Lista estratégias ativas vinculadas à campanha",
  security: bearer,
  request: { params: CampaignIdParamSchema },
  responses: {
    200: {
      description: "Lista (não vazia)",
      content: {
        "application/json": { schema: MessageSendStrategyByCampaignListSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Nenhuma estratégia vinculada à campanha" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/messageSendStrategies/{id}",
  tags: ["Messages"],
  summary: "Obtém estratégia de envio por id (inclui pacientes-alvo quando aplicável)",
  security: bearer,
  request: { params: MessageEntityIdParamSchema },
  responses: {
    200: {
      description: "Estratégia",
      content: {
        "application/json": { schema: GetMessageSendStrategyResponseSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/messageSendStrategies",
  tags: ["Messages"],
  summary: "Cria estratégia de envio (validação fina de params por kind no servidor)",
  security: bearer,
  request: {
    body: {
      content: { "application/json": { schema: CreateMessageSendStrategyBodySchema } },
    },
  },
  responses: {
    201: {
      description: "Criada",
      content: {
        "application/json": { schema: MessageSendStrategyItemResponseSchema },
      },
    },
    400: { description: "Corpo inválido (Zod ou regras de params/kind)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/messageSendStrategies/{id}",
  tags: ["Messages"],
  summary: "Atualiza estratégia de envio",
  security: bearer,
  request: {
    params: MessageEntityIdParamSchema,
    body: {
      content: { "application/json": { schema: UpdateMessageSendStrategyBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Atualizada",
      content: {
        "application/json": { schema: MessageSendStrategyItemResponseSchema },
      },
    },
    400: { description: "Parâmetros/corpo inválidos (Zod ou regras de params/kind)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "put",
  path: "/messageSendStrategies/campaigns/{campaignId}",
  tags: ["Messages"],
  summary: "Substitui vínculos de estratégias à campanha",
  security: bearer,
  request: {
    params: CampaignIdParamSchema,
    body: {
      content: { "application/json": { schema: BindCampaignStrategiesBodySchema } },
    },
  },
  responses: {
    204: { description: "Vínculos atualizados" },
    400: { description: "Parâmetros/corpo inválidos (Zod) ou regra de negócio" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/messageSendStrategies/campaigns/{campaignId}",
  tags: ["Messages"],
  summary: "Remove todos os vínculos de estratégias da campanha",
  security: bearer,
  request: { params: CampaignIdParamSchema },
  responses: {
    204: { description: "Vínculos removidos" },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/messageSendStrategies/{id}",
  tags: ["Messages"],
  summary: "Remove estratégia de envio",
  security: bearer,
  request: { params: MessageEntityIdParamSchema },
  responses: {
    204: { description: "Removida" },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/messages/logs",
  tags: ["Messages"],
  summary: "Lista logs de envio WhatsApp (filtros opcionais)",
  security: bearer,
  request: { query: ListWhatsAppMessageLogsQuerySchema },
  responses: {
    200: {
      description: "Lista paginada",
      content: {
        "application/json": { schema: ListWhatsAppMessageLogsResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod) ou filtros inválidos" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/messages/logs/patient/{patientId}",
  tags: ["Messages"],
  summary: "Lista logs de WhatsApp por paciente",
  security: bearer,
  request: {
    params: PatientIdParamSchema,
    query: ListPageLimitQuerySchema,
  },
  responses: {
    200: {
      description: "Lista paginada",
      content: {
        "application/json": { schema: ListWhatsAppMessageLogsResponseSchema },
      },
    },
    400: { description: "Parâmetros/query inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/messages/logs/summary",
  tags: ["Messages"],
  summary: "Resumo agregado dos logs de WhatsApp",
  security: bearer,
  request: { query: GetWhatsAppMessageLogsSummaryQuerySchema },
  responses: {
    200: {
      description: "Totais e taxas",
      content: {
        "application/json": { schema: WhatsAppMessageLogsSummaryResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});
