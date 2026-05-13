import {
  DeleteFinanceBodySchema,
  FinanceIdParamSchema,
  FinanceSchedulingIdParamSchema,
  ListFinancesQuerySchema,
  MessageResponseSchema,
  SetFinanceBodySchema,
  UpdateFinanceBodySchema,
} from "../../core/finances/controllers/financeSharedSchemas";
import {
  FinanceItemSchema,
  ListFinancesResponseSchema,
} from "../../core/finances/controllers/financeResponseSchemas";
import { openApiRegistry } from "../registry";

const bearer = [{ bearerAuth: [] }];

openApiRegistry.registerPath({
  method: "post",
  path: "/finance",
  tags: ["Finance"],
  summary: "Cria ou atualiza movimentação financeira (upsert por id gerado no cliente)",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: SetFinanceBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Registro salvo",
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
  path: "/finance/{id}",
  tags: ["Finance"],
  summary: "Obtém movimentação por id",
  security: bearer,
  request: { params: FinanceIdParamSchema },
  responses: {
    200: {
      description: "Movimentação",
      content: {
        "application/json": { schema: FinanceItemSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/finance",
  tags: ["Finance"],
  summary: "Lista movimentações do mês",
  security: bearer,
  request: { query: ListFinancesQuerySchema },
  responses: {
    200: {
      description: "Lista",
      content: {
        "application/json": { schema: ListFinancesResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod) ou yearAndMonth inválido" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/finance/scheduling/{schedulingId}",
  tags: ["Finance"],
  summary: "Obtém movimentação vinculada ao agendamento",
  security: bearer,
  request: { params: FinanceSchedulingIdParamSchema },
  responses: {
    200: {
      description: "Movimentação",
      content: {
        "application/json": { schema: FinanceItemSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
    404: { description: "Não encontrada" },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/finance",
  tags: ["Finance"],
  summary: "Atualiza movimentação",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": { schema: UpdateFinanceBodySchema },
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
    400: { description: "Corpo inválido (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/finance",
  tags: ["Finance"],
  summary: "Remove movimentação",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": { schema: DeleteFinanceBodySchema },
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
