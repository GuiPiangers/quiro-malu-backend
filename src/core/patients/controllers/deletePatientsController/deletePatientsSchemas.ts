import { z } from '../../../../schemas/zodOpenApi'

export const DeletePatientBodySchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi('DeletePatientBody')

export type DeletePatientBody = z.infer<typeof DeletePatientBodySchema>
