import { z } from '../../../../schemas/zodOpenApi'

const phoneBrPattern = /^\(\d{2}\) \d{5} \d{4}$/

const passwordBodySchema = z
  .string()
  .min(5, 'A senha deve conter pelo menos 5 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(
    /[0-9!"#$%&'(.)*+,/:;<=>?@[\]^_`{|}~-]/,
    'A senha deve conter pelo menos um número ou carácter especial',
  )

export const CreateUserBodySchema = z
  .object({
    name: z
      .string()
      .min(3, 'Deve ser informado no mínimo 3 caracteres')
      .max(120, 'Deve ser informado no máximo 120 caracteres'),
    email: z.string().email(),
    phone: z
      .string()
      .regex(phoneBrPattern, 'Telefone no formato (DD) NNNNN NNNN'),
    password: passwordBodySchema,
    clinicId: z.string(),
    roleId: z.string(),
  })
  .openapi('CreateUserBody')

export const CreateUserResponseSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    clinicId: z.string(),
    roleId: z.string(),
  })
  .openapi('CreateUserResponse')

export type CreateUserBody = z.infer<typeof CreateUserBodySchema>
