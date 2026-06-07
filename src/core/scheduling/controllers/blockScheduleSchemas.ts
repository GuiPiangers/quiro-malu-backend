import { z } from '../../../schemas/zodOpenApi'
import {
  SCHEDULING_DATE_ONLY_QUERY_DOC,
  SCHEDULING_DATE_TIME_WRITE_DOC,
} from './schedulingSharedSchemas'

export const AddBlockScheduleBodySchema = z
  .object({
    userId: z
      .string()
      .min(1)
      .describe('Profissional (clínico) dono do bloqueio na agenda'),
    date: z.string().min(1).describe(SCHEDULING_DATE_TIME_WRITE_DOC),
    endDate: z.string().min(1).describe(SCHEDULING_DATE_TIME_WRITE_DOC),
    description: z.string().optional(),
  })
  .openapi('AddBlockScheduleBody')

export const ListBlockSchedulesQuerySchema = z
  .object({
    startDate: z.string().min(1).describe(SCHEDULING_DATE_ONLY_QUERY_DOC),
    endDate: z.string().min(1).describe(SCHEDULING_DATE_ONLY_QUERY_DOC),
  })
  .openapi('ListBlockSchedulesQuery')

export const BlockScheduleIdParamSchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi('BlockScheduleIdParam')

export const EditBlockScheduleBodySchema = z
  .object({
    userId: z
      .string()
      .min(1)
      .describe('Profissional (clínico) dono do bloqueio na agenda'),
    date: z.string().describe(SCHEDULING_DATE_TIME_WRITE_DOC).optional(),
    endDate: z.string().describe(SCHEDULING_DATE_TIME_WRITE_DOC).optional(),
    description: z.string().optional(),
  })
  .openapi('EditBlockScheduleBody')
