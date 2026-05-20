import { z } from "../../../../schemas/zodOpenApi";
import { CreateUserBodySchema } from "../../../authentication/controllers/createUserController/createUserSchemas";
import { ServiceItemSchema } from "../../../service/controllers/serviceResponseSchemas";

const ClinicianServiceRefSchema = z
  .object({
    serviceId: z.string().uuid(),
  })
  .openapi("ClinicianServiceRef");

export const CreateClinicianBodySchema = CreateUserBodySchema.omit({
  clinicId: true,
})
  .extend({
    services: z.array(ClinicianServiceRefSchema).optional().default([]),
  })
  .openapi("CreateClinicianBody");

export const CreateClinicianResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    clinicId: z.string().uuid(),
    roleId: z.string().uuid().optional(),
    services: z.array(ServiceItemSchema),
  })
  .openapi("CreateClinicianResponse");

export type CreateClinicianBody = z.infer<typeof CreateClinicianBodySchema>;
