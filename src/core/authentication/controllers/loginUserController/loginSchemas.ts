import { z } from '../../../../schemas/zodOpenApi'

export const LoginBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .openapi('LoginBody')

export const LoginUserSummarySchema = z
  .object({
    email: z.email(),
    name: z.string(),
    clinicId: z.string(),
  })
  .openapi('LoginUserSummary')

export const LoginResponseSchema = z
  .object({
    token: z.string(),
    refreshToken: z.string(),
    user: LoginUserSummarySchema,
  })
  .openapi('LoginResponse')

export type LoginBody = z.infer<typeof LoginBodySchema>
