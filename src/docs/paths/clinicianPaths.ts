import {
  ClinicianItemSchema,
  ListClinicianUsersResponseSchema,
} from "../../core/clinician/controllers/clinicianResponseSchemas";
import {
  CreateClinicianBodySchema,
  CreateClinicianResponseSchema,
} from "../../core/clinician/controllers/createClinicianController/createClinicianSchemas";
import { openApiRegistry } from "../registry";

const bearer = [{ bearerAuth: [] }];

openApiRegistry.registerPath({
  method: "get",
  path: "/clinicians",
  tags: ["Users"],
  summary: "Listar clínicos da clínica autenticada",
  security: bearer,
  responses: {
    200: {
      description: "Lista de clínicos (sem senha)",
      content: {
        "application/json": { schema: ListClinicianUsersResponseSchema },
      },
    },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/clinicians",
  tags: ["Users"],
  summary: "Cadastrar usuário clínico (user + perfil clinician + serviços vinculados)",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateClinicianBodySchema,
          example: {
            name: "Dr. João Clínico",
            email: "joao.clinico@exemplo.com",
            phone: "(51) 98888 7777",
            password: "Senha123",
            roleId: "aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee",
            services: [{ serviceId: "00000000-0000-4000-8000-000000000002" }],
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Clínico criado",
      content: {
        "application/json": { schema: CreateClinicianResponseSchema },
      },
    },
    400: { description: "Corpo inválido ou regra de negócio" },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão" },
    404: { description: "Clínica não encontrada" },
  },
});
