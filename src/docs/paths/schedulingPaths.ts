import {
  AddBlockScheduleBodySchema,
  BlockScheduleIdParamSchema,
  EditBlockScheduleBodySchema,
  ListBlockSchedulesQuerySchema,
} from "../../core/scheduling/controllers/blockScheduleSchemas";
import {
  ListBlockSchedulesResponseSchema,
  ListEventSuggestionsResponseSchema,
  ListEventsResponseSchema,
  ListSchedulesResponseSchema,
  QtdSchedulesResponseSchema,
  SchedulingPersistedSchema,
  SchedulingWithPatientResponseSchema,
} from "../../core/scheduling/controllers/schedulingResponseSchemas";
import {
  CreateSchedulingBodySchema,
  DeleteSchedulingBodySchema,
  ListEventSuggestionsQuerySchema,
  ListEventsQuerySchema,
  ListSchedulesQuerySchema,
  MessageResponseSchema,
  QtdSchedulesQuerySchema,
  RealizeSchedulingBodySchema,
  SchedulingIdParamSchema,
  UpdateSchedulingBodySchema,
} from "../../core/scheduling/controllers/schedulingSharedSchemas";
import { openApiRegistry } from "../registry";

const bearer = [{ bearerAuth: [] }];

openApiRegistry.registerPath({
  method: "get",
  path: "/schedules",
  tags: ["Scheduling"],
  summary: "Lista agendamentos por data",
  security: bearer,
  request: { query: ListSchedulesQuerySchema },
  responses: {
    200: {
      description: "Lista paginada",
      content: {
        "application/json": { schema: ListSchedulesResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/schedules/qtd",
  tags: ["Scheduling"],
  summary: "Quantidade de agendamentos por dia (mês/ano)",
  security: bearer,
  request: { query: QtdSchedulesQuerySchema },
  responses: {
    200: {
      description: "Totais por dia",
      content: {
        "application/json": { schema: QtdSchedulesResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/schedules/{id}",
  tags: ["Scheduling"],
  summary: "Obtém agendamento por id",
  security: bearer,
  request: { params: SchedulingIdParamSchema },
  responses: {
    200: {
      description: "Agendamento",
      content: {
        "application/json": { schema: SchedulingWithPatientResponseSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/schedules",
  tags: ["Scheduling"],
  summary: "Cria agendamento",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": { schema: CreateSchedulingBodySchema },
      },
    },
  },
  responses: {
    201: {
      description: "Criado",
      content: {
        "application/json": { schema: SchedulingPersistedSchema },
      },
    },
    400: { description: "Corpo inválido (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/schedules",
  tags: ["Scheduling"],
  summary: "Atualiza agendamento",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": { schema: UpdateSchedulingBodySchema },
      },
    },
  },
  responses: {
    201: {
      description: "Atualizado",
      content: {
        "application/json": { schema: SchedulingPersistedSchema },
      },
    },
    400: { description: "Corpo inválido (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/realizeScheduling",
  tags: ["Scheduling"],
  summary: "Marca consulta como realizada",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": { schema: RealizeSchedulingBodySchema },
      },
    },
  },
  responses: {
    201: {
      description: "Consulta realizada",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    400: { description: "Corpo inválido (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/schedules",
  tags: ["Scheduling"],
  summary: "Remove agendamento",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": { schema: DeleteSchedulingBodySchema },
      },
    },
  },
  responses: {
    200: {
      description: "Removido",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    400: { description: "Corpo inválido (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/blockSchedules",
  tags: ["Scheduling"],
  summary: "Bloqueia intervalo na agenda",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": { schema: AddBlockScheduleBodySchema },
      },
    },
  },
  responses: {
    201: {
      description: "Bloqueio criado",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    400: { description: "Corpo inválido (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/blockSchedules",
  tags: ["Scheduling"],
  summary: "Lista bloqueios no intervalo",
  security: bearer,
  request: { query: ListBlockSchedulesQuerySchema },
  responses: {
    200: {
      description: "Lista de bloqueios",
      content: {
        "application/json": { schema: ListBlockSchedulesResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/blockSchedules/{id}",
  tags: ["Scheduling"],
  summary: "Atualiza bloqueio",
  security: bearer,
  request: {
    params: BlockScheduleIdParamSchema,
    body: {
      content: {
        "application/json": { schema: EditBlockScheduleBodySchema },
      },
    },
  },
  responses: {
    200: {
      description: "Atualizado",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    400: { description: "Parâmetros ou corpo inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/blockSchedules/{id}",
  tags: ["Scheduling"],
  summary: "Remove bloqueio",
  security: bearer,
  request: { params: BlockScheduleIdParamSchema },
  responses: {
    200: {
      description: "Removido",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/events",
  tags: ["Scheduling"],
  summary: "Lista eventos do dia",
  security: bearer,
  request: { query: ListEventsQuerySchema },
  responses: {
    200: {
      description: "Eventos",
      content: {
        "application/json": { schema: ListEventsResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/event-suggestions",
  tags: ["Scheduling"],
  summary: "Sugestões de eventos (filtro opcional)",
  security: bearer,
  request: { query: ListEventSuggestionsQuerySchema },
  responses: {
    200: {
      description: "Sugestões",
      content: {
        "application/json": { schema: ListEventSuggestionsResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});
