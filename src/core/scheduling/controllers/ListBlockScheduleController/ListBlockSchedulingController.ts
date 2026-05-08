import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { ListBlockSchedulingUseCase } from "../../useCases/blockScheduling/listBlockSchedules/ListBlockSchedulingUseCase";
import { ListBlockSchedulesQuerySchema } from "../blockScheduleSchemas";

export class ListBlockScheduleController {
  constructor(private listBlockScheduleUseCase: ListBlockSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListBlockSchedulesQuerySchema, request.query);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const { startDate, endDate } = parsed.data;
      const userId = request.user.id as string;

      const blockSchedules = await this.listBlockScheduleUseCase.execute({
        endDate,
        startDate,
        userId,
      });

      response.status(200).json(blockSchedules);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
