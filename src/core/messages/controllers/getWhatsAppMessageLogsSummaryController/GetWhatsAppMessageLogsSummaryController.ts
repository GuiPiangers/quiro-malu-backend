import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { GetWhatsAppMessageLogsSummaryUseCase } from "../../useCases/whatsAppMessageLogs/getWhatsAppMessageLogsSummary/GetWhatsAppMessageLogsSummaryUseCase";
import { GetWhatsAppMessageLogsSummaryQuerySchema } from "../whatsAppMessageLogsSchemas";

export class GetWhatsAppMessageLogsSummaryController {
  constructor(
    private getWhatsAppMessageLogsSummaryUseCase: GetWhatsAppMessageLogsSummaryUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(GetWhatsAppMessageLogsSummaryQuerySchema, request.query);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const userId = request.user.id!;
      const q = parsed.data;

      const res = await this.getWhatsAppMessageLogsSummaryUseCase.execute({
        userId,
        patientId: q.patientId,
        scheduleMessageType: q.scheduleMessageType,
        scheduleMessageConfigId: q.scheduleMessageConfigId,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
