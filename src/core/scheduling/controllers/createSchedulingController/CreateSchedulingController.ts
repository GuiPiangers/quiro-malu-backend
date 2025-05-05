import { CreateSchedulingUseCase } from "../../useCases/createScheduling/CreateSchedulingUseCase";
import { Request, Response } from "express";
import { SchedulingDTO } from "../../models/Scheduling";
import { responseError } from "../../../../utils/ResponseError";

export class CreateSchedulingController {
  constructor(private createScheduleUseCase: CreateSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const data = request.body as SchedulingDTO & { date: string };
      const userId = request.user.id as string;

      const scheduling = await this.createScheduleUseCase.execute({
        ...data,
        userId,
      });
      response.status(201).json(scheduling);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
