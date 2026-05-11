import { z } from "../../schemas/zodOpenApi";
import { DeletePatientBodySchema } from "../../core/patients/controllers/deletePatientsController/deletePatientsSchemas";
import { SetAnamnesisBodySchema } from "../../core/patients/controllers/setAnamnesisController/anamnesisBodySchemas";
import { SetDiagnosticBodySchema } from "../../core/patients/controllers/setDiagnosticController/diagnosticBodySchemas";
import {
  MessageResponseSchema,
  PatientIdParamSchema,
  PatientIdPathParamSchema,
  PatientWriteBodySchema,
} from "../../core/patients/controllers/patientSharedSchemas";
import {
  AnamnesisResponseSchema,
  GetDiagnosticResponseSchema,
  ListPatientsResponseSchema,
  ListProgressResponseSchema,
  PatientSavedSchema,
  ProgressDTOSchema,
  UploadPatientsResponseSchema,
} from "../../core/patients/controllers/patientResponseSchemas";
import { ListPatientsQuerySchema } from "../../core/patients/controllers/listPatientsController/listPatientsSchemas";
import {
  DeleteProgressBodySchema,
  ProgressBySchedulingParamsSchema,
  ProgressEntryParamsSchema,
  SetProgressBodySchema,
} from "../../core/patients/controllers/progress/progressBodySchemas";
import { ListProgressQuerySchema } from "../../core/patients/controllers/progress/listProgressSchemas";
import { openApiRegistry } from "../registry";

const bearer = [{ bearerAuth: [] }];

const UploadPatientsMultipartSchema = z
  .object({
    file: z.any().openapi({
      type: "string",
      format: "binary",
      description: "Arquivo CSV",
    }),
  })
  .openapi("UploadPatientsMultipart");

openApiRegistry.registerPath({
  method: "post",
  path: "/patients",
  tags: ["Patients"],
  summary: "Cria paciente",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: PatientWriteBodySchema,
          example: {
            name: "João da Silva",
            phone: "(51) 99999 9999",
            gender: "masculino",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Paciente criado",
      content: {
        "application/json": { schema: PatientSavedSchema },
      },
    },
    400: { description: "Corpo inválido (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/patients",
  tags: ["Patients"],
  summary: "Lista pacientes (paginação, busca e ordenação)",
  security: bearer,
  request: {
    query: ListPatientsQuerySchema,
  },
  responses: {
    200: {
      description: "Lista e total",
      content: {
        "application/json": { schema: ListPatientsResponseSchema },
      },
    },
    400: { description: "Query inválida (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/patients/{id}",
  tags: ["Patients"],
  summary: "Obtém paciente por id",
  security: bearer,
  request: {
    params: PatientIdParamSchema,
  },
  responses: {
    200: {
      description: "Paciente",
      content: {
        "application/json": { schema: PatientSavedSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/patients",
  tags: ["Patients"],
  summary: "Atualiza paciente",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: PatientWriteBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
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
  path: "/patients",
  tags: ["Patients"],
  summary: "Remove paciente",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: DeletePatientBodySchema,
          example: { id: "00000000-0000-4000-8000-000000000001" },
        },
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
  method: "get",
  path: "/patients/anamnesis/{patientId}",
  tags: ["Patients"],
  summary: "Obtém anamnese do paciente",
  security: bearer,
  request: {
    params: PatientIdPathParamSchema,
  },
  responses: {
    200: {
      description: "Dados da anamnese",
      content: {
        "application/json": { schema: AnamnesisResponseSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "put",
  path: "/patients/anamnesis",
  tags: ["Patients"],
  summary: "Define anamnese",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: SetAnamnesisBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Salvo",
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
  path: "/patients/diagnostic/{patientId}",
  tags: ["Patients"],
  summary: "Obtém diagnóstico e plano de tratamento",
  security: bearer,
  request: {
    params: PatientIdPathParamSchema,
  },
  responses: {
    200: {
      description: "Diagnóstico",
      content: {
        "application/json": { schema: GetDiagnosticResponseSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "put",
  path: "/patients/diagnostic",
  tags: ["Patients"],
  summary: "Define diagnóstico e plano",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: SetDiagnosticBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Salvo",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    400: { description: "Corpo inválido (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "put",
  path: "/patients/progress",
  tags: ["Patients"],
  summary: "Cria ou atualiza evolução (progresso)",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: SetProgressBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Evolução salva",
      content: {
        "application/json": { schema: ProgressDTOSchema },
      },
    },
    400: { description: "Corpo inválido (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/patients/progress",
  tags: ["Patients"],
  summary: "Remove evolução",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: DeleteProgressBodySchema,
        },
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
  method: "get",
  path: "/patients/progress/{patientId}",
  tags: ["Patients"],
  summary: "Lista evoluções do paciente",
  security: bearer,
  request: {
    params: PatientIdPathParamSchema,
    query: ListProgressQuerySchema,
  },
  responses: {
    200: {
      description: "Lista paginada",
      content: {
        "application/json": { schema: ListProgressResponseSchema },
      },
    },
    400: { description: "Parâmetros ou query inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/patients/progress/{patientId}/{id}",
  tags: ["Patients"],
  summary: "Obtém evolução por id",
  security: bearer,
  request: {
    params: ProgressEntryParamsSchema,
  },
  responses: {
    200: {
      description: "Evolução",
      content: {
        "application/json": { schema: ProgressDTOSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/patients/progress/scheduling/{patientId}/{schedulingId}",
  tags: ["Patients"],
  summary: "Obtém evolução vinculada ao agendamento",
  security: bearer,
  request: {
    params: ProgressBySchedulingParamsSchema,
  },
  responses: {
    200: {
      description: "Evolução",
      content: {
        "application/json": { schema: ProgressDTOSchema },
      },
    },
    400: { description: "Parâmetros inválidos (Zod)" },
    401: { description: "Não autenticado" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/uploadPatients",
  tags: ["Patients"],
  summary: "Importa pacientes via CSV (multipart)",
  description:
    "Envie o arquivo no campo de formulário `file` (`multipart/form-data`).",
  security: bearer,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: UploadPatientsMultipartSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Resultado da importação",
      content: {
        "application/json": { schema: UploadPatientsResponseSchema },
      },
    },
    400: { description: "Arquivo ausente ou inválido" },
    401: { description: "Não autenticado" },
  },
});
