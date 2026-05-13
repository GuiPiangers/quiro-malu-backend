import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { ListWhatsAppMessageLogsByPatientUseCase } from "../../useCases/whatsAppMessageLogs/listWhatsAppMessageLogsByPatient/ListWhatsAppMessageLogsByPatientUseCase";
import { ListPageLimitQuerySchema, PatientIdParamSchema } from "../messagesCommonSchemas";

export class ListWhatsAppMessageLogsByPatientController {
  constructor(
    private listWhatsAppMessageLogsByPatientUseCase: ListWhatsAppMessageLogsByPatientUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(PatientIdParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }
    const parsedQuery = parseWithSchema(ListPageLimitQuerySchema, request.query);
    if (!parsedQuery.success) {
      return sendZodBadRequest(response, parsedQuery.error);
    }

    try {
      const userId = request.user.id!;
      const { patientId } = parsedParams.data;
      const { page, limit } = parsedQuery.data;

      const res = await this.listWhatsAppMessageLogsByPatientUseCase.execute({
        userId,
        patientId,
        page,
        limit,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
