import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { GetWhatsAppMessageLogsSummaryUseCase } from "../../useCases/whatsAppMessageLogs/getWhatsAppMessageLogsSummary/GetWhatsAppMessageLogsSummaryUseCase";

export class GetWhatsAppMessageLogsSummaryController {
  constructor(
    private getWhatsAppMessageLogsSummaryUseCase: GetWhatsAppMessageLogsSummaryUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id!;
      const { patientId, scheduleMessageType, scheduleMessageConfigId } =
        request.query;

      const res = await this.getWhatsAppMessageLogsSummaryUseCase.execute({
        userId,
        patientId:
          typeof patientId === "string" && patientId.trim()
            ? patientId
            : undefined,
        scheduleMessageType:
          typeof scheduleMessageType === "string" && scheduleMessageType.trim()
            ? (scheduleMessageType.trim() as any)
            : undefined,
        scheduleMessageConfigId:
          typeof scheduleMessageConfigId === "string" &&
          scheduleMessageConfigId.trim()
            ? scheduleMessageConfigId
            : undefined,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
