import { Request, Response } from "express";
import { responseError } from "../../../../../utils/ResponseError";
import { ApiError } from "../../../../../utils/ApiError";
import { GetProgressBySchedulingUseCase } from "../../../useCases/progress/getProgressByScheduling/GetProgressBySchedulingUseCase";

export class GetProgressBySchedulingController {
  constructor(private getProgressUseCase: GetProgressBySchedulingUseCase) {}
  async handle(request: Request, response: Response) {
    try {
      const { schedulingId, patientId } = request.params;
      const userId = request.user.id;

      if (!schedulingId)
        throw new ApiError("O id e o patientId devem ser informados", 400);

      const progress = await this.getProgressUseCase.execute({
        schedulingId,
        patientId,
        userId: userId!,
      });

      response.status(200).json(progress);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
