import { z } from "../../../../schemas/zodOpenApi";

export const UserItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    clinicId: z.string(),
    roleId: z.string().nullable(),
  })
  .openapi("UserItem");

export const ListUsersResponseSchema = z
  .array(UserItemSchema)
  .openapi("ListUsersResponse");
