import { z } from '../../../../schemas/zodOpenApi'
import { ServiceItemSchema } from '../../../service/controllers/serviceResponseSchemas'
import { UserItemSchema } from '../listUsersController/listUsersSchemas'

export const StandardUserDetailSchema = UserItemSchema.extend({
  kind: z.literal('user'),
}).openapi('StandardUserDetail')

export const ClinicianUserDetailSchema = UserItemSchema.extend({
  kind: z.literal('clinician'),
  services: z.array(ServiceItemSchema),
}).openapi('ClinicianUserDetail')

export const UserDetailSchema = z
  .discriminatedUnion('kind', [
    StandardUserDetailSchema,
    ClinicianUserDetailSchema,
  ])
  .openapi('UserDetail')
