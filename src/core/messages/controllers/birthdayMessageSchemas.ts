import { z } from '../../../schemas/zodOpenApi'
import { MessageTemplateNestedSchema } from './messagesCommonSchemas'

export const BIRTHDAY_SEND_TIME_DOC =
  'Horário de envio no dia do aniversário, formato `HH:mm` ou `H:mm` (00:00–23:59). Fuso America/Sao_Paulo na fila.'

export const CreateBirthdayMessageBodySchema = z
  .object({
    name: z.string().min(1),
    isActive: z.boolean().optional(),
    sendTime: z.string().optional().describe(BIRTHDAY_SEND_TIME_DOC),
    messageTemplate: MessageTemplateNestedSchema,
  })
  .openapi('CreateBirthdayMessageBody')

export const UpdateBirthdayMessageBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
    sendTime: z.string().optional().describe(BIRTHDAY_SEND_TIME_DOC),
    messageTemplate: MessageTemplateNestedSchema.optional(),
  })
  .openapi('UpdateBirthdayMessageBody')
