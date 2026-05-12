import { z } from "../../../schemas/zodOpenApi";
import { SchedulingStatusSchema } from "./schedulingSharedSchemas";

/** Retorno de `Scheduling.getDTO()` (POST create / PATCH update — update pode omitir `id`). */
export const SchedulingPersistedSchema = z
  .object({
    id: z.string().optional(),
    patientId: z.string(),
    date: z.string().optional(),
    duration: z.number().optional(),
    status: SchedulingStatusSchema.optional(),
    service: z.string().optional(),
    reminderSentAt: z.string().nullable().optional(),
  })
  .openapi("SchedulingPersisted");

/** Retorno de `SchedulingWithPatient.getDTO()` (GET lista / GET por id). */
export const SchedulingWithPatientResponseSchema = SchedulingPersistedSchema.extend({
  patient: z.string(),
  phone: z.string(),
}).openapi("SchedulingWithPatientResponse");

export const ListSchedulesResponseSchema = z
  .object({
    schedules: z.array(SchedulingWithPatientResponseSchema),
    total: z.number(),
    limit: z.number(),
  })
  .openapi("ListSchedulesResponse");

export const QtdScheduleByDayItemSchema = z
  .object({
    date: z.string(),
    qtd: z.number(),
  })
  .openapi("QtdScheduleByDayItem");

export const QtdSchedulesResponseSchema = z
  .array(QtdScheduleByDayItemSchema)
  .openapi("QtdSchedulesResponse");

/** Item de bloqueio retornado por `ListBlockSchedulingUseCase` / `BlockSchedule.getDTO()`. */
export const BlockScheduleResponseSchema = z
  .object({
    id: z.string().optional(),
    date: z.string(),
    endDate: z.string(),
    description: z.string().optional(),
  })
  .openapi("BlockScheduleResponse");

export const ListBlockSchedulesResponseSchema = z
  .array(BlockScheduleResponseSchema)
  .openapi("ListBlockSchedulesResponse");

/**
 * Agendamento em `ListEventsUseCase`: objeto vindo do Knex (join com paciente),
 * não passa por `SchedulingWithPatient.getDTO()`.
 */
export const SchedulingCalendarRowSchema = z
  .object({
    id: z.string().optional(),
    patientId: z.string(),
    patient: z.string(),
    phone: z.string(),
    date: z.string().optional(),
    duration: z.number().optional(),
    status: SchedulingStatusSchema.optional(),
    service: z.string().optional(),
    reminderSentAt: z.string().nullable().optional(),
    createAt: z.string().optional(),
    updateAt: z.string().optional(),
  })
  .passthrough()
  .openapi("SchedulingCalendarRow");

export const ListEventsResponseSchema = z
  .object({
    data: z.array(
      z.union([SchedulingCalendarRowSchema, BlockScheduleResponseSchema]),
    ),
  })
  .openapi("ListEventsResponse");

/** Retorno de `EventSuggestion.getDTO()`. */
export const EventSuggestionItemSchema = z
  .object({
    id: z.string().optional(),
    description: z.string(),
    durationInMinutes: z.number(),
    frequency: z.number(),
  })
  .openapi("EventSuggestionItem");

export const ListEventSuggestionsResponseSchema = z
  .object({
    data: z.array(EventSuggestionItemSchema),
  })
  .openapi("ListEventSuggestionsResponse");
