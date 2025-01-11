import { GetProgressUseCase } from "../../../useCases/progress/getProgress/GetProgressUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../../utils/ResponseError";
import { ApiError } from "../../../../../utils/ApiError";

export class GetProgressController {
  constructor(private getProgressUseCase: GetProgressUseCase) {}
  async handle(request: Request, response: Response) {
    try {
      const { id, patientId } = request.params;
      const userId = request.user.id;

      if (!id)
        throw new ApiError("O id e o patientId devem ser informados", 400);

      const progress = await this.getProgressUseCase.execute({
        id,
        patientId,
        userId: userId!,
      });

      response.status(200).json(progress);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
