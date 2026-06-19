import { z } from '../../../../schemas/zodOpenApi'

export const SendResetPasswordTokenBodySchema = z
  .object({
    email: z.string().email(),
  })
  .openapi('SendResetPasswordTokenBody')

export const SendResetPasswordTokenResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi('SendResetPasswordTokenResponse')
