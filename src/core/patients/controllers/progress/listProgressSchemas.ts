import { z } from '../../../../schemas/zodOpenApi'

export const ListProgressQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1),
  })
  .openapi('ListProgressQuery')

export type ListProgressQuery = z.infer<typeof ListProgressQuerySchema>
