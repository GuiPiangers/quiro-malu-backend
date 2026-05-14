import {
  CreateClinicBodySchema,
  CreateClinicResponseSchema,
} from "../../core/clinics/controllers/createClinicController/createClinicSchemas";
import { openApiRegistry } from "../registry";

openApiRegistry.registerPath({
  method: "post",
  path: "/clinics",
  tags: ["Clinics"],
  summary: "Cria clínica",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateClinicBodySchema,
          example: {
            name: "Clínica Quiro Malu",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Clínica criada",
      content: {
        "application/json": { schema: CreateClinicResponseSchema },
      },
    },
    400: { description: "Corpo inválido ou clínica já cadastrada" },
  },
});
