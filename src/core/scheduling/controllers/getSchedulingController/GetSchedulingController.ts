import { GetSchedulingUseCase } from "../../useCases/getScheduling/GetSchedulingUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { SchedulingIdParamSchema } from "../schedulingSharedSchemas";

export class GetSchedulingController {
  constructor(private getSchedulingUseCase: GetSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(SchedulingIdParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }

    try {
      const { id } = parsedParams.data;
      const clinicId = request.user.clinicId as string;

      const scheduling = await this.getSchedulingUseCase.execute({
        id,
        clinicId,
      });
      response.status(200).json(scheduling);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}