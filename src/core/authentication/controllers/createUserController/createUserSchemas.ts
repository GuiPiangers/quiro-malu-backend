import { z } from '../../../../schemas/zodOpenApi'

export const CreateUserBodySchema = z
  .object({
    name: z
      .string()
      .min(3, 'Deve ser informado no mínimo 3 caracteres')
      .max(120, 'Deve ser informado no máximo 120 caracteres'),
    email: z.string().email(),
    phone: z
      .string(),
    clinicId: z.string(),
    roleId: z.string(),
  })
  .openapi('CreateUserBody')

export const CreateUserResponseSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    email: z.email(),
    phone: z.string(),
    clinicId: z.string(),
    roleId: z.string(),
  })
  .openapi('CreateUserResponse')

export type CreateUserBody = z.infer<typeof CreateUserBodySchema>
