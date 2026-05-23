import { z } from '../../../schemas/zodOpenApi'

export const WhatsAppLogStatusSchema = z.enum([
  'PENDING',
  'SENT',
  'DELIVERED',
  'READ',
  'FAILED',
])

export const ScheduleMessageTypeQuerySchema = z.enum([
  'beforeSchedule',
  'afterSchedule',
  'birthday',
])

function emptyQueryToUndefined<T extends z.ZodTypeAny>(inner: T) {
  return z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined
    return val
  }, inner.optional())
}

export const ListWhatsAppMessageLogsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    patientId: emptyQueryToUndefined(z.string().min(1)),
    scheduleMessageType: emptyQueryToUndefined(ScheduleMessageTypeQuerySchema),
    scheduleMessageConfigId: emptyQueryToUndefined(z.string().min(1)),
    status: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined
      return typeof val === 'string'
        ? val.trim().toUpperCase()
        : val
    }, WhatsAppLogStatusSchema.optional()),
  })
  .openapi('ListWhatsAppMessageLogsQuery')

export const GetWhatsAppMessageLogsSummaryQuerySchema = z
  .object({
    patientId: emptyQueryToUndefined(z.string().min(1)),
    scheduleMessageType: emptyQueryToUndefined(ScheduleMessageTypeQuerySchema),
    scheduleMessageConfigId: emptyQueryToUndefined(z.string().min(1)),
  })
  .openapi('GetWhatsAppMessageLogsSummaryQuery')
