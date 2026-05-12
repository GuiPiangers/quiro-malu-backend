import { z } from "../../../../schemas/zodOpenApi";

export const SetAnamnesisBodySchema = z
  .object({
    patientId: z.string().min(1),
    mainProblem: z.string().optional(),
    currentIllness: z.string().optional(),
    history: z.string().optional(),
    familiarHistory: z.string().optional(),
    activities: z.string().optional(),
    smoke: z.enum(["yes", "no", "passive"]).optional(),
    useMedicine: z.boolean().optional(),
    medicines: z.string().optional(),
    underwentSurgery: z.boolean().optional(),
    surgeries: z.string().optional(),
  })
  .openapi("SetAnamnesisBody");

export type SetAnamnesisBody = z.infer<typeof SetAnamnesisBodySchema>;
