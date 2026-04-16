import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { GetBeforeScheduleMessageUseCase } from "../../useCases/beforeScheduleMessage/getBeforeScheduleMessage/GetBeforeScheduleMessageUseCase";

export class GetBeforeScheduleMessageController {
  constructor(private getBeforeScheduleMessageUseCase: GetBeforeScheduleMessageUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;
      const { id } = request.params;

      const res = await this.getBeforeScheduleMessageUseCase.execute({
        id,
        userId: userId!,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
