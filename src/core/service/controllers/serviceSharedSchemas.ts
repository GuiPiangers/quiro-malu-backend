import { z } from "../../../schemas/zodOpenApi";

/** Duração do serviço na API e no domínio: sempre em segundos (ex.: 3600 = 1 hora). */
export const SERVICE_DURATION_SECONDS_DOC =
  "Duração do serviço em segundos (inteiro positivo; ex.: 3600 para 1 hora).";

export const CreateServiceBodySchema = z
  .object({
    name: z.string().min(1).max(200),
    value: z.coerce.number().nonnegative(),
    duration: z
      .number()
      .int()
      .positive()
      .describe(SERVICE_DURATION_SECONDS_DOC),
  })
  .openapi("CreateServiceBody");

export const UpdateServiceBodySchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1).max(200),
    value: z.coerce.number().nonnegative(),
    duration: z
      .number()
      .int()
      .positive()
      .describe(SERVICE_DURATION_SECONDS_DOC),
  })
  .openapi("UpdateServiceBody");

export const DeleteServiceBodySchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi("DeleteServiceBody");

export const ListServicesQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    search: z.string().optional(),
  })
  .openapi("ListServicesQuery");

export const ServiceIdParamSchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi("ServiceIdParam");

export const MessageResponseSchema = z
  .object({ message: z.string() })
  .openapi("ServiceMessageResponse");
