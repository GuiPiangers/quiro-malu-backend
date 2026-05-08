import { UpdateSchedulingUseCase } from "../../useCases/updateScheduling/UpdateSchedulingUseCase";
import { Request, Response } from "express";
import { SchedulingDTO } from "../../models/Scheduling";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { UpdateSchedulingBodySchema } from "../schedulingSharedSchemas";

export class UpdateSchedulingController {
  constructor(private updateSchedulingUseCase: UpdateSchedulingUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(UpdateSchedulingBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const data = parsed.data;
      const userId = request.user.id;

      const scheduling = await this.updateSchedulingUseCase.execute({
        ...data,
        userId: userId!,
      } as SchedulingDTO & { userId: string });

      response.status(201).json(scheduling);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
