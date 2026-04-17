import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { GetAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/getAfterScheduleMessage/GetAfterScheduleMessageUseCase";

export class GetAfterScheduleMessageController {
  constructor(
    private getAfterScheduleMessageUseCase: GetAfterScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id!;

      const res = await this.getAfterScheduleMessageUseCase.execute({
        id,
        userId,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
