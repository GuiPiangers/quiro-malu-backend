import { z } from '../../../../schemas/zodOpenApi'

export const CreateClinicBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    owner: z.object({
      name: z.string(),
      email: z.email(),
      phone: z.string(),
      password: z.string(),
    }),
  })
  .openapi('CreateClinicBody')

export const CreateClinicResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .openapi('CreateClinicResponse')

export type CreateClinicBody = z.infer<typeof CreateClinicBodySchema>
