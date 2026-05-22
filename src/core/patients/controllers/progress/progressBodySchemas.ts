import { z } from "../../../../schemas/zodOpenApi";

export const PainScaleItemSchema = z
  .object({
    id: z.string().optional(),
    painLevel: z.number().min(0).max(10),
    description: z.string().min(1),
  })
  .openapi("PainScaleItem");

export const SetProgressBodySchema = z
  .object({
    id: z.string().optional(),
    userId: z
      .string()
      .min(1)
      .describe("Id do clínico (usuário) responsável pela evolução"),
    schedulingId: z.string().optional(),
    patientId: z.string().min(1),
    service: z.string().optional(),
    actualProblem: z.string().optional(),
    procedures: z.string().optional(),
    date: z.string().optional(),
    createAt: z.string().optional(),
    updateAt: z.string().optional(),
    painScales: z.array(PainScaleItemSchema).optional(),
  })
  .openapi("SetProgressBody");

export const DeleteProgressBodySchema = z
  .object({
    id: z.string().min(1),
    patientId: z.string().min(1),
  })
  .openapi("DeleteProgressBody");

export const ProgressEntryParamsSchema = z
  .object({
    patientId: z.string().min(1),
    id: z.string().min(1),
  })
  .openapi("ProgressEntryParams");

export const ProgressBySchedulingParamsSchema = z
  .object({
    patientId: z.string().min(1),
    schedulingId: z.string().min(1),
  })
  .openapi("ProgressBySchedulingParams");

export type SetProgressBody = z.infer<typeof SetProgressBodySchema>;
export type DeleteProgressBody = z.infer<typeof DeleteProgressBodySchema>;
