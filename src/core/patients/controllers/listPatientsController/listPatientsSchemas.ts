import { z } from '../../../../schemas/zodOpenApi'

export const ListPatientsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1),
    limit: z
      .union([z.literal('all'), z.coerce.number().int().positive()])
      .optional(),
    search: z
      .string()
      .describe(
        'String JSON na query (URL-encoded). Formato: `{"name":"valor"}`. Por enquanto só o campo `name` é usado na busca (prefixo do nome). Vazio ou ausente equivale a `{"name":""}`.',
      )
      .optional()
      .transform((val, ctx) => {
        if (val === undefined || val === '') return { name: '' }
        try {
          return JSON.parse(val) as { name?: string }
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'search deve ser JSON válido (ex.: {"name":"Jo"})',
          })
          return z.NEVER
        }
      }),
    orderBy: z
      .string()
      .describe(
        'String JSON na query (URL-encoded): array de critérios de ordenação. Formato: `[{"field":"nome_do_campo","orientation":"ASC"|"DESC"}]`. Ex.: `[{"field":"updated_at","orientation":"DESC"}]`. Vazio, ausente ou `null` = sem ordenação explícita (usa padrão do caso de uso).',
      )
      .optional()
      .transform((val, ctx) => {
        if (val === undefined || val === '') return undefined
        const trimmed = val.trim()
        if (trimmed === 'null' || trimmed === 'undefined') return undefined
        try {
          const parsed = JSON.parse(val)
          if (parsed === null) return undefined
          if (!Array.isArray(parsed)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'orderBy deve ser um array JSON',
            })
            return z.NEVER
          }
          return parsed as { field: string; orientation: 'ASC' | 'DESC' }[]
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'orderBy deve ser JSON válido',
          })
          return z.NEVER
        }
      }),
  })
  .openapi('ListPatientsQuery')

export type ListPatientsQuery = z.infer<typeof ListPatientsQuerySchema>
