import { z } from '../../../../schemas/zodOpenApi'

export const ResetPasswordBodySchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(6),
  })
  .openapi('ResetPasswordBody')

export const ResetPasswordResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi('ResetPasswordResponse')
