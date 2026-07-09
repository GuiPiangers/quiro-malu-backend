import { z } from '../../../../schemas/zodOpenApi'
import type { UserDetailDTO } from '../../userDetailDto'

export const GetUserProfileResponseSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    clinicId: z.string(),
    roleId: z.string().nullable().optional(),
    kind: z.enum(['user', 'clinician']),
    services: z.array(z.any()).optional(),
  })
  .passthrough()
  .openapi('GetUserProfileResponse')

export type GetUserProfileResponse = UserDetailDTO
