import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { GetWhatsAppMessageLogsSummaryUseCase } from "../../useCases/getWhatsAppMessageLogsSummary/GetWhatsAppMessageLogsSummaryUseCase";

export class GetWhatsAppMessageLogsSummaryController {
  constructor(
    private getWhatsAppMessageLogsSummaryUseCase: GetWhatsAppMessageLogsSummaryUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id!;
      const { patientId, beforeScheduleMessageId } = request.query;

      const res = await this.getWhatsAppMessageLogsSummaryUseCase.execute({
        userId,
        patientId:
          typeof patientId === "string" && patientId.trim()
            ? patientId
            : undefined,
        beforeScheduleMessageId:
          typeof beforeScheduleMessageId === "string" &&
          beforeScheduleMessageId.trim()
            ? beforeScheduleMessageId
            : undefined,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
