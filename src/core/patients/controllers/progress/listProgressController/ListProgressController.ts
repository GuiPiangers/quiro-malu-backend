import { ListProgressUseCase } from "../../../useCases/progress/listProgress/ListProgressUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../../utils/zodValidation";
import { PatientIdPathParamSchema } from "../../patientSharedSchemas";
import { ListProgressQuerySchema } from "../listProgressSchemas";

export class ListProgressController {
  constructor(private listProgressUseCase: ListProgressUseCase) {}
  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(PatientIdPathParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }
    const parsedQuery = parseWithSchema(ListProgressQuerySchema, request.query);
    if (!parsedQuery.success) {
      return sendZodBadRequest(response, parsedQuery.error);
    }

    try {
      const { patientId } = parsedParams.data;
      const { page } = parsedQuery.data;
      const userId = request.user.id;

      const progress = await this.listProgressUseCase.execute({
        patientId,
        userId: userId!,
        page,
      });
      response.status(200).json(progress);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
