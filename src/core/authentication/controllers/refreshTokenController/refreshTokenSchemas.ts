import { z } from "../../../../schemas/zodOpenApi";

export const RefreshTokenBodySchema = z
  .object({
    refreshTokenId: z.string().uuid(),
  })
  .openapi("RefreshTokenBody");

export const RefreshTokenResponseSchema = z
  .object({
    token: z.string(),
    refreshToken: z.string().uuid(),
  })
  .openapi("RefreshTokenResponse");

export type RefreshTokenBody = z.infer<typeof RefreshTokenBodySchema>;
