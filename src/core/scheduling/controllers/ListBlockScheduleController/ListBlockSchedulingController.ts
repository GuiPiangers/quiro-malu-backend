import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ListBlockSchedulingUseCase } from "../../useCases/blockScheduling/listBlockSchedules/ListBlockSchedulingUseCase";

export class ListBlockScheduleController {
  constructor(private listBlockScheduleUseCase: ListBlockSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const data = request.body as {
        startDate: string;
        endDate: string;
        description?: string;
      };
      const userId = request.user.id as string;

      const blockSchedules = await this.listBlockScheduleUseCase.execute({
        ...data,
        userId,
      });

      response.status(200).json(blockSchedules);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
