import { z } from '../../../schemas/zodOpenApi'

const phoneBrPattern = /^\(\d{2}\) \d{5} \d{4}$/

export const LocationBodySchema = z
  .object({
    cep: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    neighborhood: z.string().optional(),
    address: z.string().optional(),
  })
  .openapi('PatientLocationBody')

export const PatientWriteBodySchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(3).max(120),
    phone: z.string().regex(phoneBrPattern, 'Telefone no formato (DD) NNNNN NNNN'),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['masculino', 'feminino']).optional(),
    cpf: z.string().optional(),
    location: LocationBodySchema.optional(),
    education: z
      .enum([
        'superior completo',
        'superior incompleto',
        'medio completo',
        'medio incompleto',
        'fundamental completo',
        'fundamental incompleto',
      ])
      .optional(),
    profession: z.string().optional(),
    maritalStatus: z
      .enum(['casado', 'solteiro', 'viuvo', 'divorciado'])
      .optional(),
  })
  .openapi('PatientWriteBody')

export const PatientIdParamSchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi('PatientIdParam')

export const PatientIdPathParamSchema = z
  .object({
    patientId: z.string().min(1),
  })
  .openapi('PatientIdPathParam')

export const MessageResponseSchema = z
  .object({ message: z.string() })
  .openapi('PatientMessageResponse')
