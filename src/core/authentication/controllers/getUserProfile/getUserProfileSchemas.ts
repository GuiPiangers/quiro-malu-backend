import { z } from '../../../../schemas/zodOpenApi'
import type { UserDTO } from '../../models/User'

/**
 * Perfil público (sem senha). Alinhado a `UserDTO` omitindo `password`;
 * `passthrough` permite colunas extras do `SELECT *` no repositório.
 */
export const GetUserProfileResponseSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    clinicId: z.string(),
    roleId: z.string().optional(),
  })
  .passthrough()
  .openapi('GetUserProfileResponse')

export type GetUserProfileResponse = Omit<UserDTO, 'password'>
