import { z } from '../../../schemas/zodOpenApi'
import {
  MessageTemplateNestedSchema,
} from './messagesCommonSchemas'

const MINUTES_BEFORE_DOC =
  'Minutos antes do horário da consulta para enviar a mensagem (inteiro > 0).'

const MINUTES_AFTER_DOC =
  'Minutos após o horário da consulta para enviar a mensagem (inteiro > 0).'

export const CreateBeforeScheduleMessageBodySchema = z
  .object({
    name: z.string().min(1),
    minutesBeforeSchedule: z
      .number()
      .int()
      .positive()
      .describe(MINUTES_BEFORE_DOC),
    isActive: z.boolean().optional(),
    messageTemplate: MessageTemplateNestedSchema,
  })
  .openapi('CreateBeforeScheduleMessageBody')

export const UpdateBeforeScheduleMessageBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    minutesBeforeSchedule: z
      .number()
      .int()
      .positive()
      .describe(MINUTES_BEFORE_DOC)
      .optional(),
    isActive: z.boolean().optional(),
    messageTemplate: MessageTemplateNestedSchema.optional(),
  })
  .openapi('UpdateBeforeScheduleMessageBody')

export const CreateAfterScheduleMessageBodySchema = z
  .object({
    name: z.string().min(1),
    minutesAfterSchedule: z
      .number()
      .int()
      .positive()
      .describe(MINUTES_AFTER_DOC),
    isActive: z.boolean().optional(),
    messageTemplate: MessageTemplateNestedSchema,
  })
  .openapi('CreateAfterScheduleMessageBody')

export const UpdateAfterScheduleMessageBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    minutesAfterSchedule: z
      .number()
      .int()
      .positive()
      .describe(MINUTES_AFTER_DOC)
      .optional(),
    isActive: z.boolean().optional(),
    messageTemplate: MessageTemplateNestedSchema.optional(),
  })
  .openapi('UpdateAfterScheduleMessageBody')
