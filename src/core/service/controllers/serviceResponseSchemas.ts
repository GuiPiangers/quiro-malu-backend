import { z } from "../../../schemas/zodOpenApi";
import { SERVICE_DURATION_SECONDS_DOC } from "./serviceSharedSchemas";

/** Retorno de `Service.getDTO()` / repositório. */
export const ServiceItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    value: z.number(),
    duration: z.number().describe(SERVICE_DURATION_SECONDS_DOC),
  })
  .openapi("ServiceItem");

export const ListServicesResponseSchema = z
  .object({
    services: z.array(ServiceItemSchema),
    total: z.number(),
    limit: z.number(),
  })
  .openapi("ListServicesResponse");
