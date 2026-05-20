import { z } from "../../../../schemas/zodOpenApi";

export const CreateClinicBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120),
  })
  .openapi("CreateClinicBody");

export const CreateClinicResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .openapi("CreateClinicResponse");

export type CreateClinicBody = z.infer<typeof CreateClinicBodySchema>;
