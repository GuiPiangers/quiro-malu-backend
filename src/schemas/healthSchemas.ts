import { z } from './zodOpenApi'

export const HealthResponseSchema = z
  .object({
    status: z.literal('ok'),
  })
  .openapi('HealthResponse')

export type HealthResponse = z.infer<typeof HealthResponseSchema>
