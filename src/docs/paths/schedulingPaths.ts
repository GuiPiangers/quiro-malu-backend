import {
  AddBlockScheduleBodySchema,
  BlockScheduleIdParamSchema,
  EditBlockScheduleBodySchema,
  ListBlockSchedulesQuerySchema,
} from '../../core/scheduling/controllers/blockScheduleSchemas'
import {
  ListBlockSchedulesResponseSchema,
  ListEventSuggestionsResponseSchema,
  ListEventsResponseSchema,
  ListSchedulesResponseSchema,
  QtdSchedulesResponseSchema,
  SchedulingPersistedSchema,
  SchedulingWithPatientResponseSchema,
} from '../../core/scheduling/controllers/schedulingResponseSchemas'
import {
  CreateSchedulingBodySchema,
  DeleteSchedulingBodySchema,
  ListEventSuggestionsQuerySchema,
  ListEventsQuerySchema,
  ListEventsByUserBodySchema,
  ListSchedulesQuerySchema,
  MessageResponseSchema,
  QtdSchedulesMonthYearQuerySchema,
  QtdSchedulesParamsSchema,
  RealizeSchedulingBodySchema,
  SchedulingIdParamSchema,
  UpdateSchedulingBodySchema,
} from '../../core/scheduling/controllers/schedulingSharedSchemas'
import { openApiRegistry } from '../registry'

const bearer = [{ bearerAuth: [] }]

openApiRegistry.registerPath({
  method: 'get',
  path: '/schedules',
  tags: ['Scheduling'],
  summary: 'Lista agendamentos por data',
  security: bearer,
  request: { query: ListSchedulesQuerySchema },
  responses: {
    200: {
      description: 'Lista paginada',
      content: {
        'application/json': { schema: ListSchedulesResponseSchema },
      },
    },
    400: { description: 'Query inválida (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'get',
  path: '/schedules/qtd/{userId}',
  tags: ['Scheduling'],
  summary: 'Quantidade de agendamentos por dia (mês/ano) de um profissional',
  description:
    'Path: `userId`. Query: `month`, `year`. O `clinicId` vem do token. Contagens consideram apenas agendamentos desse usuário na clínica.',
  security: bearer,
  request: {
    params: QtdSchedulesParamsSchema,
    query: QtdSchedulesMonthYearQuerySchema,
  },
  responses: {
    200: {
      description: 'Totais por dia',
      content: {
        'application/json': { schema: QtdSchedulesResponseSchema },
      },
    },
    400: { description: 'Query inválida (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'get',
  path: '/schedules/{id}',
  tags: ['Scheduling'],
  summary: 'Obtém agendamento por id',
  security: bearer,
  request: { params: SchedulingIdParamSchema },
  responses: {
    200: {
      description: 'Agendamento',
      content: {
        'application/json': { schema: SchedulingWithPatientResponseSchema },
      },
    },
    400: { description: 'Parâmetros inválidos (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'post',
  path: '/schedules',
  tags: ['Scheduling'],
  summary: 'Cria agendamento',
  description:
    'O `userId` no corpo identifica o profissional dono do horário (não o usuário autenticado). `clinicId` vem do token.',
  security: bearer,
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateSchedulingBodySchema,
          example: {
            userId: '00000000-0000-4000-8000-000000000010',
            patientId: '00000000-0000-4000-8000-000000000020',
            date: '2026-05-06T14:30',
            duration: 3600,
            service: 'Sessão',
            status: 'Agendado',
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Criado',
      content: {
        'application/json': { schema: SchedulingPersistedSchema },
      },
    },
    400: { description: 'Corpo inválido (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'patch',
  path: '/schedules',
  tags: ['Scheduling'],
  summary: 'Atualiza agendamento',
  security: bearer,
  request: {
    body: {
      content: {
        'application/json': { schema: UpdateSchedulingBodySchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Atualizado',
      content: {
        'application/json': { schema: SchedulingPersistedSchema },
      },
    },
    400: { description: 'Corpo inválido (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'post',
  path: '/realizeScheduling',
  tags: ['Scheduling'],
  summary: 'Marca consulta como realizada',
  security: bearer,
  request: {
    body: {
      content: {
        'application/json': { schema: RealizeSchedulingBodySchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Consulta realizada',
      content: {
        'application/json': { schema: MessageResponseSchema },
      },
    },
    400: { description: 'Corpo inválido (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'delete',
  path: '/schedules',
  tags: ['Scheduling'],
  summary: 'Remove agendamento',
  security: bearer,
  request: {
    body: {
      content: {
        'application/json': { schema: DeleteSchedulingBodySchema },
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

openApiRegistry.registerPath({
  method: 'post',
  path: '/blockSchedules',
  tags: ['Scheduling'],
  summary: 'Bloqueia intervalo na agenda',
  security: bearer,
  request: {
    body: {
      content: {
        'application/json': { schema: AddBlockScheduleBodySchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Bloqueio criado',
      content: {
        'application/json': { schema: MessageResponseSchema },
      },
    },
    400: { description: 'Corpo inválido (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'get',
  path: '/blockSchedules',
  tags: ['Scheduling'],
  summary: 'Lista bloqueios no intervalo',
  security: bearer,
  request: { query: ListBlockSchedulesQuerySchema },
  responses: {
    200: {
      description: 'Lista de bloqueios',
      content: {
        'application/json': { schema: ListBlockSchedulesResponseSchema },
      },
    },
    400: { description: 'Query inválida (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'patch',
  path: '/blockSchedules/{id}',
  tags: ['Scheduling'],
  summary: 'Atualiza bloqueio',
  security: bearer,
  request: {
    params: BlockScheduleIdParamSchema,
    body: {
      content: {
        'application/json': { schema: EditBlockScheduleBodySchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Atualizado',
      content: {
        'application/json': { schema: MessageResponseSchema },
      },
    },
    400: { description: 'Parâmetros ou corpo inválidos (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'delete',
  path: '/blockSchedules/{id}',
  tags: ['Scheduling'],
  summary: 'Remove bloqueio',
  security: bearer,
  request: { params: BlockScheduleIdParamSchema },
  responses: {
    200: {
      description: 'Removido',
      content: {
        'application/json': { schema: MessageResponseSchema },
      },
    },
    400: { description: 'Parâmetros inválidos (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'get',
  path: '/events',
  tags: ['Scheduling'],
  summary: 'Lista eventos do dia',
  security: bearer,
  request: { query: ListEventsQuerySchema },
  responses: {
    200: {
      description: 'Eventos',
      content: {
        'application/json': { schema: ListEventsResponseSchema },
      },
    },
    400: { description: 'Query inválida (Zod)' },
    401: { description: 'Não autenticado' },
  },
})

openApiRegistry.registerPath({
  method: 'post',
  path: '/events/by-user',
  tags: ['Scheduling'],
  summary: 'Lista eventos do dia para um userId (corpo)',
  description:
    'Mesmo payload que `GET /events`, porém `userId` vem no JSON (ex.: ver agenda de outro profissional). O `clinicId` é sempre o da sessão; agendamentos são filtrados por `clinicId` + `userId` no repositório.',
  security: bearer,
  request: {
    body: {
      content: {
        'application/json': {
          schema: ListEventsByUserBodySchema,
          example: {
            userId: '00000000-0000-4000-8000-0000000000aa',
            date: '2026-05-14',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Eventos',
      content: {
        'application/json': { schema: ListEventsResponseSchema },
      },
    },
    400: { description: 'Corpo inválido (Zod)' },
    401: { description: 'Não autenticado' },
    403: { description: 'Sem permissão `events:read`' },
  },
})

openApiRegistry.registerPath({
  method: 'get',
  path: '/event-suggestions',
  tags: ['Scheduling'],
  summary: 'Sugestões de eventos (filtro opcional)',
  security: bearer,
  request: { query: ListEventSuggestionsQuerySchema },
  responses: {
    200: {
      description: 'Sugestões',
      content: {
        'application/json': { schema: ListEventSuggestionsResponseSchema },
      },
    },
    400: { description: 'Query inválida (Zod)' },
    401: { description: 'Não autenticado' },
  },
})
