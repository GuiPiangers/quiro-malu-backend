import { z } from "../../../../schemas/zodOpenApi";

export const ListPatientsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1),
    limit: z.union([z.literal("all"), z.coerce.number().int().positive()]).optional(),
    search: z.string().optional().transform((val, ctx) => {
      if (val === undefined || val === "") return { name: "" };
      try {
        return JSON.parse(val) as { name?: string };
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "search deve ser JSON válido (ex.: {\"name\":\"Jo\"})",
        });
        return z.NEVER;
      }
    }),
    orderBy: z.string().optional().transform((val, ctx) => {
      if (val === undefined || val === "") return undefined;
      const trimmed = val.trim();
      if (trimmed === "null" || trimmed === "undefined") return undefined;
      try {
        const parsed = JSON.parse(val);
        if (parsed === null) return undefined;
        if (!Array.isArray(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "orderBy deve ser um array JSON",
          });
          return z.NEVER;
        }
        return parsed as { field: string; orientation: "ASC" | "DESC" }[];
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "orderBy deve ser JSON válido",
        });
        return z.NEVER;
      }
    }),
  })
  .openapi("ListPatientsQuery");

export type ListPatientsQuery = z.infer<typeof ListPatientsQuerySchema>;
