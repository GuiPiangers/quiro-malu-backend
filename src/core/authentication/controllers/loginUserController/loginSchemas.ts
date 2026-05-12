import { z } from "../../../../schemas/zodOpenApi";

export const LoginBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .openapi("LoginBody");

export const LoginUserSummarySchema = z
  .object({
    email: z.string().email(),
    name: z.string(),
  })
  .openapi("LoginUserSummary");

export const LoginResponseSchema = z
  .object({
    token: z.string(),
    refreshToken: z.string().uuid(),
    user: LoginUserSummarySchema,
  })
  .openapi("LoginResponse");

export type LoginBody = z.infer<typeof LoginBodySchema>;
