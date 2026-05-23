import { z } from '../../../schemas/zodOpenApi'
import { SEND_STRATEGY_KINDS } from '../sendStrategy/sendStrategyKind'

export const SendStrategyKindSchema = z.enum(SEND_STRATEGY_KINDS)

export const CreateMessageSendStrategyBodySchema = z
  .object({
    name: z.string().optional(),
    kind: SendStrategyKindSchema.optional().describe(
      'Padrão: `send_most_recent_patients`. Validação de `params` por tipo permanece em `buildValidatedCreateMessageSendStrategyDTO`.',
    ),
    params: z
      .record(z.string(), z.unknown())
      .optional()
      .describe(
        'Ex.: `{ "amount": 10 }` para estratégias por quantidade; `{ "patientIdList": ["uuid"] }` para listas.',
      ),
  })
  .openapi('CreateMessageSendStrategyBody')

export const UpdateMessageSendStrategyBodySchema = z
  .object({
    name: z.string().optional(),
    kind: SendStrategyKindSchema.optional(),
    params: z.record(z.string(), z.unknown()).optional(),
  })
  .openapi('UpdateMessageSendStrategyBody')

export const BindCampaignStrategiesBodySchema = z
  .object({
    strategyIds: z.array(z.string()).optional(),
  })
  .openapi('BindCampaignStrategiesBody')
