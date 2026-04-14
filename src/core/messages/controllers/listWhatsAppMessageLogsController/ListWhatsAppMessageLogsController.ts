import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ListWhatsAppMessageLogsUseCase } from "../../useCases/listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase";

export class ListWhatsAppMessageLogsController {
  constructor(
    private listWhatsAppMessageLogsUseCase: ListWhatsAppMessageLogsUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id!;

      const {
        page,
        limit,
        patientId,
        beforeScheduleMessageId,
        status,
      } = request.query;

      const res = await this.listWhatsAppMessageLogsUseCase.execute({
        userId,
        page: page != null ? Number(page) : undefined,
        limit: limit != null ? Number(limit) : undefined,
        patientId:
          typeof patientId === "string" && patientId.trim()
            ? patientId
            : undefined,
        beforeScheduleMessageId:
          typeof beforeScheduleMessageId === "string" &&
          beforeScheduleMessageId.trim()
            ? beforeScheduleMessageId
            : undefined,
        status:
          typeof status === "string" && status.trim() ? status : undefined,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
