import { z } from '../../../schemas/zodOpenApi'

export const MessageTemplateNestedSchema = z
  .object({
    textTemplate: z.string().min(1),
  })
  .openapi('MessageTemplateNested')

export const MessageEntityIdParamSchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi('MessageEntityIdParam')

export const CampaignIdParamSchema = z
  .object({
    campaignId: z.string().min(1),
  })
  .openapi('MessagesCampaignIdParam')

export const PatientIdParamSchema = z
  .object({
    patientId: z.string().min(1),
  })
  .openapi('MessagesPatientIdParam')

export const ListPageLimitQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  })
  .openapi('MessagesListPageLimitQuery')

export const MessageResponseSchema = z
  .object({ message: z.string() })
  .openapi('MessagesMessageResponse')
