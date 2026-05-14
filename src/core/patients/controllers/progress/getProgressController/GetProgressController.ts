import { GetProgressUseCase } from "../../../useCases/progress/getProgress/GetProgressUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../../utils/zodValidation";
import { ProgressEntryParamsSchema } from "../progressBodySchemas";

export class GetProgressController {
  constructor(private getProgressUseCase: GetProgressUseCase) {}
  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(ProgressEntryParamsSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }

    try {
      const { id, patientId } = parsedParams.data;
      const clinicId = request.user.clinicId!;

      const progress = await this.getProgressUseCase.execute({
        id,
        patientId,
        clinicId,
      });

      response.status(200).json(progress);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
