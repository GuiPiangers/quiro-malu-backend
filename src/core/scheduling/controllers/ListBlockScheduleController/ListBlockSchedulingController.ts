import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ListBlockSchedulingUseCase } from "../../useCases/blockScheduling/listBlockSchedules/ListBlockSchedulingUseCase";
import { ApiError } from "../../../../utils/ApiError";

export class ListBlockScheduleController {
  constructor(private listBlockScheduleUseCase: ListBlockSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { startDate, endDate } = request.query;
      const userId = request.user.id as string;

      if (!startDate || !endDate) {
        throw new ApiError("Start date and end date are required");
      }

      const blockSchedules = await this.listBlockScheduleUseCase.execute({
        endDate: endDate as string,
        startDate: startDate as string,
        userId,
      });

      response.status(200).json(blockSchedules);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
