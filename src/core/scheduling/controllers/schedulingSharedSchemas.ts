import { z } from "../../../schemas/zodOpenApi";

/** Documentação OpenAPI: corpos de escrita (create/update). Validação fina nos models. */
export const SCHEDULING_DATE_TIME_WRITE_DOC =
  "Formato esperado: `yyyy-mm-ddThh:mm` (ex.: `2026-05-06T14:30`)";

/** Documentação OpenAPI: filtros de busca por dia. Validação fina nos models. */
export const SCHEDULING_DATE_ONLY_QUERY_DOC =
  "Formato esperado: `yyyy-mm-dd` (ex.: `2026-05-06`)";

export const SchedulingStatusSchema = z.enum([
  "Agendado",
  "Atendido",
  "Atrasado",
  "Cancelado",
]);

export const MessageResponseSchema = z
  .object({ message: z.string() })
  .openapi("SchedulingMessageResponse");

export const CreateSchedulingBodySchema = z
  .object({
    userId: z
      .string()
      .min(1)
      .describe("Usuário (profissional) dono do agendamento na clínica"),
    patientId: z.string().min(1),
    date: z.string().min(1).describe(SCHEDULING_DATE_TIME_WRITE_DOC),
    duration: z.number().positive(),
    service: z.string().optional(),
    status: SchedulingStatusSchema.optional(),
  })
  .openapi("CreateSchedulingBody");

export const UpdateSchedulingBodySchema = z
  .object({
    id: z.string().min(1),
    patientId: z.string().min(1).optional(),
    date: z.string().describe(SCHEDULING_DATE_TIME_WRITE_DOC).optional(),
    duration: z.number().positive().optional(),
    service: z.string().optional(),
    status: SchedulingStatusSchema.optional(),
    reminderSentAt: z.string().nullable().optional(),
    createAt: z.string().optional(),
    updateAt: z.string().optional(),
  })
  .openapi("UpdateSchedulingBody");

export const DeleteSchedulingBodySchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi("DeleteSchedulingBody");

export const RealizeSchedulingBodySchema = z
  .object({
    id: z.string().min(1),
    patientId: z.string().min(1),
  })
  .openapi("RealizeSchedulingBody");

export const SchedulingIdParamSchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi("SchedulingIdParam");

export const ListSchedulesQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    date: z.string().min(1).describe(SCHEDULING_DATE_ONLY_QUERY_DOC),
  })
  .openapi("ListSchedulesQuery");

export const QtdSchedulesQuerySchema = z
  .object({
    month: z.coerce.number().int().min(1).max(12),
    year: z.coerce.number().int().min(2000).max(2100),
  })
  .openapi("QtdSchedulesQuery");

export const ListEventsQuerySchema = z
  .object({
    date: z.string().min(1).describe(SCHEDULING_DATE_ONLY_QUERY_DOC),
  })
  .openapi("ListEventsQuery");

export const ListEventsByUserBodySchema = z
  .object({
    userId: z.string().min(1),
    date: z.string().min(1).describe(SCHEDULING_DATE_ONLY_QUERY_DOC),
  })
  .openapi("ListEventsByUserBody");

export const ListEventSuggestionsQuerySchema = z
  .object({
    filter: z.string().optional(),
  })
  .openapi("ListEventSuggestionsQuery");
