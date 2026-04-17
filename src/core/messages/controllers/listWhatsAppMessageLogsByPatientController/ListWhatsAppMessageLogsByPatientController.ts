import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ListWhatsAppMessageLogsByPatientUseCase } from "../../useCases/whatsAppMessageLogs/listWhatsAppMessageLogsByPatient/ListWhatsAppMessageLogsByPatientUseCase";

export class ListWhatsAppMessageLogsByPatientController {
  constructor(
    private listWhatsAppMessageLogsByPatientUseCase: ListWhatsAppMessageLogsByPatientUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id!;
      const { patientId } = request.params;
      const { page, limit } = request.query;

      const res = await this.listWhatsAppMessageLogsByPatientUseCase.execute({
        userId,
        patientId,
        page: page != null ? Number(page) : undefined,
        limit: limit != null ? Number(limit) : undefined,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
