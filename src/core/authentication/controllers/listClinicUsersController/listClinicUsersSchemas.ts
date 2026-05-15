import { z } from "../../../../schemas/zodOpenApi";

export const ListClinicUsersItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    clinicId: z.string(),
    roleId: z.string().nullable(),
  })
  .openapi("ListClinicUsersItem");

export const ListClinicUsersResponseSchema = z
  .array(ListClinicUsersItemSchema)
  .openapi("ListClinicUsersResponse");
