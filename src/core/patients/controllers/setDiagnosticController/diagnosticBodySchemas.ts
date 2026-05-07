import { z } from "../../../../schemas/zodOpenApi";

export const SetDiagnosticBodySchema = z
  .object({
    patientId: z.string().min(1),
    diagnostic: z.string().optional(),
    treatmentPlan: z.string().optional(),
  })
  .openapi("SetDiagnosticBody");

export type SetDiagnosticBody = z.infer<typeof SetDiagnosticBodySchema>;
