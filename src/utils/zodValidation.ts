import type { Response } from 'express'
import type { ZodError, ZodSchema } from 'zod'

export type ZodFieldErrors = ReturnType<ZodError['flatten']>

export function zodFieldErrors(error: ZodError): ZodFieldErrors {
  return error.flatten()
}

export function parseWithSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
):
  | { success: true; data: T }
  | { success: false; error: ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

export function sendZodBadRequest(
  response: Response,
  error: ZodError,
): Response {
  return response.status(400).json({
    error: true,
    message: 'Validation failed',
    errors: zodFieldErrors(error),
  })
}
