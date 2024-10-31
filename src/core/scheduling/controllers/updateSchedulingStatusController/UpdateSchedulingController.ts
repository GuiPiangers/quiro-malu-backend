import { Request, Response } from "express";
import { SchedulingDTO, SchedulingStatus } from "../../models/Scheduling";
import { responseError } from "../../../../utils/ResponseError";
import { UpdateSchedulingStatusUseCase } from "../../useCases/updateSchedulingStatus/UpdateSchedulingStatus";

export class UpdateSchedulingController {
  constructor(
    private updateSchedulingStatusUseCase: UpdateSchedulingStatusUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const data = request.body as {
        id: string;
        patientId: string;
        status: SchedulingStatus;
      };
      const userId = request.user.id;

      const scheduling = await this.updateSchedulingStatusUseCase.execute({
        ...data,
        userId: userId!,
      });
      response.status(201).json(scheduling);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
