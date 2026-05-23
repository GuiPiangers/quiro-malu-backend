import {
  CreateServiceBodySchema,
  DeleteServiceBodySchema,
  ListServicesQuerySchema,
  MessageResponseSchema,
  ServiceIdParamSchema,
  UpdateServiceBodySchema,
} from '../../core/service/controllers/serviceSharedSchemas'
import {
  ListServicesResponseSchema,
  ServiceItemSchema,
} from '../../core/service/controllers/serviceResponseSchemas'
import { openApiRegistry } from '../registry'

const bearer = [{ bearerAuth: [] }]

openApiRegistry.registerPath({
  method: 'get',
  path: '/services',
  tags: ['Services'],
  summary: 'Lista serviços (paginação e busca por nome)',
  description: 'Cada item em `services` inclui `duration` em segundos.',
  security: bearer,
  request: { query: ListServicesQuerySchema },
  responses: {
    200: {
      description: 'Lista, total e limite por página',
      content: {
        'application/json': { schema: ListServicesResponseSchema },
      },
    },
    400: { description: 'Query inválida (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'get',
  path: '/services/{id}',
  tags: ['Services'],
  summary: 'Obtém serviço por id',
  description: 'O campo `duration` está em segundos.',
  security: bearer,
  request: { params: ServiceIdParamSchema },
  responses: {
    200: {
      description: 'Serviço',
      content: {
        'application/json': { schema: ServiceItemSchema },
      },
    },
    400: { description: 'Parâmetros inválidos (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'post',
  path: '/services',
  tags: ['Services'],
  summary: 'Cria serviço',
  description:
    '`duration` é sempre em segundos (ex.: `3600` = 1 hora de serviço).',
  security: bearer,
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateServiceBodySchema,
          example: {
            name: 'Consulta',
            value: 150,
            duration: 3600,
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Serviço criado (`duration` em segundos)',
      content: {
        'application/json': { schema: ServiceItemSchema },
      },
    },
    400: { description: 'Corpo inválido (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'patch',
  path: '/services',
  tags: ['Services'],
  summary: 'Atualiza serviço',
  description:
    '`duration` é sempre em segundos (ex.: `3600` = 1 hora de serviço).',
  security: bearer,
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateServiceBodySchema,
          example: {
            id: '00000000-0000-4000-8000-000000000001',
            name: 'Consulta',
            value: 150,
            duration: 3600,
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Serviço atualizado (`duration` em segundos)',
      content: {
        'application/json': { schema: ServiceItemSchema },
      },
    },
    400: { description: 'Corpo inválido (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'delete',
  path: '/services',
  tags: ['Services'],
  summary: 'Remove serviço',
  security: bearer,
  request: {
    body: {
      content: {
        'application/json': {
          schema: DeleteServiceBodySchema,
          example: { id: '00000000-0000-4000-8000-000000000001' },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Removido',
      content: {
        'application/json': { schema: MessageResponseSchema },
      },
    },
    400: { description: 'Corpo inválido (Zod)' },
    401: { description: 'Não autenticado' },
  },
})
