import { z } from '../../../schemas/zodOpenApi'
import { FinanceTypeSchema } from './financeSharedSchemas'

export const FinanceItemSchema = z
  .object({
    id: z.string().optional(),
    date: z.string(),
    description: z.string(),
    type: FinanceTypeSchema,
    paymentMethod: z.string(),
    value: z.number(),
    patientId: z.string().optional(),
    schedulingId: z.string().optional(),
    service: z.string().optional(),
  })
  .openapi('FinanceItem')

export const ListFinancesResponseSchema = z
  .array(FinanceItemSchema)
  .openapi('ListFinancesResponse')
