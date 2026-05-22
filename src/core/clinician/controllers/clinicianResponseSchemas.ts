import { z } from "../../../schemas/zodOpenApi";
import { ServiceItemSchema } from "../../service/controllers/serviceResponseSchemas";

export const ClinicianItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    clinicId: z.string(),
    roleId: z.string().optional(),
    services: z.array(ServiceItemSchema),
  })
  .openapi("ClinicianItem");

export const ListClinicianUsersResponseSchema = z
  .object({
    result: z.array(ClinicianItemSchema),
  })
  .openapi("ListClinicianUsersResponse");
