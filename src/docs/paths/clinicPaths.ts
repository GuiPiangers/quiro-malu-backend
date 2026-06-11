import {
  CreateClinicBodySchema,
  CreateClinicResponseSchema,
} from '../../core/clinics/controllers/createClinicController/createClinicSchemas'
import { openApiRegistry } from '../registry'

/** Onboarding: criar clínica antes do cadastro de usuário (ver `Auth` / `register`). */
openApiRegistry.registerPath({
  method: 'post',
  path: '/clinics',
  tags: ['Clinics'],
  summary: 'Cria clínica',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateClinicBodySchema,
          example: {
            name: 'Clínica Quiro Malu',
            owner: {
              name: 'Dr. João',
              email: 'joao@example.com',
              phone: '(11) 98765 4321',
              password: 'StrongP@ssw0rd',
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Clínica criada',
      content: {
        'application/json': { schema: CreateClinicResponseSchema },
      },
    },
    400: { description: 'Corpo inválido ou clínica já cadastrada' },
  },
})
