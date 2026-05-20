import { z } from "../../../schemas/zodOpenApi";
import { ServiceItemSchema } from "../../service/controllers/serviceResponseSchemas";

export const ClinicianItemSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    clinicId: z.string().uuid(),
    roleId: z.string().uuid().optional(),
    services: z.array(ServiceItemSchema),
  })
  .openapi("ClinicianItem");

export const ListClinicianUsersResponseSchema = z
  .array(ClinicianItemSchema)
  .openapi("ListClinicianUsersResponse");
