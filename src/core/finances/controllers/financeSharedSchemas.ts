import { z } from "../../../schemas/zodOpenApi";

export const FINANCE_DATE_WRITE_DOC =
  "Data/hora da movimentação no formato `yyyy-mm-ddThh:mm` (ex.: `2026-05-06T14:30`). Validação fina em `DateTime`.";

export const FINANCE_YEAR_MONTH_QUERY_DOC =
  "Mês de referência no formato `yyyy-mm` (ex.: `2026-05`), alinhado ao filtro do repositório.";

export const FinanceTypeSchema = z.enum(["income", "expense"]);

export const SetFinanceBodySchema = z
  .object({
    id: z.string().optional(),
    date: z.string().min(1).describe(FINANCE_DATE_WRITE_DOC),
    description: z.string().min(1),
    type: FinanceTypeSchema,
    paymentMethod: z.string().min(1),
    value: z.number(),
    patientId: z.string().optional(),
    schedulingId: z.string().optional(),
    service: z.string().optional(),
  })
  .openapi("SetFinanceBody");

export const UpdateFinanceBodySchema = SetFinanceBodySchema.extend({
  id: z.string().min(1),
}).openapi("UpdateFinanceBody");

export const DeleteFinanceBodySchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi("DeleteFinanceBody");

export const FinanceIdParamSchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi("FinanceIdParam");

export const FinanceSchedulingIdParamSchema = z
  .object({
    schedulingId: z.string().min(1),
  })
  .openapi("FinanceSchedulingIdParam");

export const ListFinancesQuerySchema = z
  .object({
    yearAndMonth: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Use o formato yyyy-mm (ex.: 2026-05)")
      .describe(FINANCE_YEAR_MONTH_QUERY_DOC),
  })
  .openapi("ListFinancesQuery");

export const MessageResponseSchema = z
  .object({ message: z.string() })
  .openapi("FinanceMessageResponse");
