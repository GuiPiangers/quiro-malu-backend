import { z } from '../../../../schemas/zodOpenApi'

export const LogoutBodySchema = z
  .object({
    refreshTokenId: z.string(),
  })
  .openapi('LogoutBody')

export const LogoutResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi('LogoutResponse')

export type LogoutBody = z.infer<typeof LogoutBodySchema>
