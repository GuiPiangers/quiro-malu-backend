import { z } from '../../../schemas/zodOpenApi'

export const MessageTemplateDtoSchema = z
  .object({
    id: z.string().optional(),
    textTemplate: z.string(),
  })
  .openapi('MessageTemplateDto')

export const BeforeScheduleMessageDtoSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    minutesBeforeSchedule: z.number().int().positive(),
    isActive: z.boolean(),
    messageTemplate: MessageTemplateDtoSchema,
  })
  .openapi('BeforeScheduleMessageDto')

export const AfterScheduleMessageDtoSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    minutesAfterSchedule: z.number().int().positive(),
    isActive: z.boolean(),
    messageTemplate: MessageTemplateDtoSchema,
  })
  .openapi('AfterScheduleMessageDto')

export const BirthdayMessageDtoSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    isActive: z.boolean(),
    sendTime: z.string(),
    messageTemplate: MessageTemplateDtoSchema,
  })
  .openapi('BirthdayMessageDto')

export const BeforeScheduleMessagesListResponseSchema = z
  .object({
    items: z.array(BeforeScheduleMessageDtoSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  })
  .openapi('BeforeScheduleMessagesListResponse')

export const AfterScheduledMessagesListResponseSchema = z
  .object({
    items: z.array(AfterScheduleMessageDtoSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  })
  .openapi('AfterScheduleMessagesListResponse')

export const BirthdayMessagesListResponseSchema = z
  .object({
    items: z.array(BirthdayMessageDtoSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  })
  .openapi('BirthdayMessagesListResponse')

export const MessageSendStrategyItemResponseSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    kind: z.string(),
    params: z.record(z.string(), z.unknown()),
    campaignBindingsCount: z.number(),
  })
  .passthrough()
  .openapi('MessageSendStrategyItem')

export const GetMessageSendStrategyResponseSchema =
  MessageSendStrategyItemResponseSchema.extend({
    patients: z.array(
      z.object({
        name: z.string(),
        phone: z.string(),
        cpf: z.string().optional(),
      }),
    ),
  }).openapi('GetMessageSendStrategyResponse')

export const ListMessageSendStrategyResponseSchema = z
  .object({
    items: z.array(MessageSendStrategyItemResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  })
  .openapi('ListMessageSendStrategyResponse')

export const WhatsAppMessageLogDtoSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    patientId: z.string(),
    schedulingId: z.string(),
    scheduleMessageType: z.enum(['beforeSchedule', 'afterSchedule', 'birthday']),
    scheduleMessageConfigId: z.string(),
    message: z.string(),
    toPhone: z.string(),
    instanceName: z.string(),
    status: z.enum(['PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED']),
    providerMessageId: z.string().nullable(),
    errorMessage: z.string().nullable(),
    sentAt: z.string().nullable(),
    deliveredAt: z.string().nullable(),
    readAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough()
  .openapi('WhatsAppMessageLogDto')

export const ListWhatsAppMessageLogsResponseSchema = z
  .object({
    items: z.array(WhatsAppMessageLogDtoSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  })
  .openapi('ListWhatsAppMessageLogsResponse')

export const WhatsAppMessageLogsSummaryResponseSchema = z
  .object({
    total: z.number(),
    byStatus: z.record(z.string(), z.number()),
    deliveryRate: z.number().nullable(),
    readRate: z.number().nullable(),
  })
  .openapi('WhatsAppMessageLogsSummary')
