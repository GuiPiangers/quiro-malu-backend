import { z } from '../../../../schemas/zodOpenApi'
import { ClinicianItemSchema } from '../clinicianResponseSchemas'

const ClinicianServiceRefSchema = z
  .object({
    serviceId: z.string(),
  })
  .openapi('SetClinicianServiceRef')

export const SetClinicianServicesBodySchema = z
  .object({
    services: z.array(ClinicianServiceRefSchema).default([]),
  })
  .openapi('SetClinicianServicesBody')

export const SetClinicianServicesResponseSchema = ClinicianItemSchema.openapi(
  'SetClinicianServicesResponse',
)

export type SetClinicianServicesBody = z.infer<
  typeof SetClinicianServicesBodySchema
>
