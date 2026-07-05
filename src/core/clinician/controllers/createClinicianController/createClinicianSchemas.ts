import { z } from '../../../../schemas/zodOpenApi'
import { CreateUserBodySchema } from '../../../authentication/controllers/createUserController/createUserSchemas'
import { ClinicianItemSchema } from '../clinicianResponseSchemas'

const ClinicianServiceRefSchema = z
  .object({
    serviceId: z.string(),
  })
  .openapi('ClinicianServiceRef')

export const CreateClinicianBodySchema = CreateUserBodySchema.omit({
  clinicId: true,
})
  .extend({
    password: z.string().min(5),
    services: z.array(ClinicianServiceRefSchema).optional().default([]),
  })
  .openapi('CreateClinicianBody')

export const CreateClinicianResponseSchema = ClinicianItemSchema.openapi(
  'CreateClinicianResponse',
)

export type CreateClinicianBody = z.infer<typeof CreateClinicianBodySchema>
