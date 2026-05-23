import {
  ClinicianItemSchema,
  ListClinicianUsersResponseSchema,
} from '../../core/clinician/controllers/clinicianResponseSchemas'
import {
  CreateClinicianBodySchema,
  CreateClinicianResponseSchema,
} from '../../core/clinician/controllers/createClinicianController/createClinicianSchemas'
import {
  SetClinicianServicesBodySchema,
  SetClinicianServicesResponseSchema,
} from '../../core/clinician/controllers/setClinicianServicesController/setClinicianServicesSchemas'
import { UserIdParamsSchema } from '../../core/rbac/schemas/rbacSchemas'
import { openApiRegistry } from '../registry'

const bearer = [{ bearerAuth: [] }]

openApiRegistry.registerPath({
  method: 'get',
  path: '/clinicians',
  tags: ['Users'],
  summary: 'Listar clínicos da clínica autenticada',
  security: bearer,
  responses: {
    200: {
      description: 'Lista de clínicos (sem senha). Corpo: `{ result: ClinicianItem[] }`.',
      content: {
        'application/json': { schema: ListClinicianUsersResponseSchema },
      },
    },
    401: { description: 'Não autenticado' },
    403: { description: 'Sem permissão' },
  },
})

openApiRegistry.registerPath({
  method: 'post',
  path: '/clinicians',
  tags: ['Users'],
  summary: 'Cadastrar usuário clínico (user + perfil clinician + serviços vinculados)',
  security: bearer,
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateClinicianBodySchema,
          example: {
            name: 'Dr. João Clínico',
            email: 'joao.clinico@exemplo.com',
            phone: '(51) 98888 7777',
            password: 'Senha123',
            roleId: 'aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee',
            services: [{ serviceId: '00000000-0000-4000-8000-000000000002' }],
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Clínico criado',
      content: {
        'application/json': { schema: CreateClinicianResponseSchema },
      },
    },
    400: { description: 'Corpo inválido ou regra de negócio' },
    401: { description: 'Não autenticado' },
    403: { description: 'Sem permissão' },
    404: { description: 'Clínica não encontrada' },
  },
})

openApiRegistry.registerPath({
  method: 'put',
  path: '/clinicians/{id}/services',
  tags: ['Users'],
  summary: 'Substituir serviços vinculados ao clínico',
  description:
    'Remove todos os vínculos atuais em `clinician_services` e recria a lista informada. Lista vazia remove todos os serviços. Requer `users:write`.',
  security: bearer,
  request: {
    params: UserIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: SetClinicianServicesBodySchema,
          example: {
            services: [
              { serviceId: '00000000-0000-4000-8000-000000000002' },
            ],
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Clínico com serviços atualizados',
      content: {
        'application/json': { schema: SetClinicianServicesResponseSchema },
      },
    },
    400: { description: 'Corpo inválido ou serviço inexistente na clínica' },
    401: { description: 'Não autenticado' },
    403: { description: 'Sem permissão' },
    404: { description: 'Clínico não encontrado' },
  },
})
