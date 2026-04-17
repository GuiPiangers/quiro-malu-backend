import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ListAfterScheduleMessagesUseCase } from "../../useCases/afterScheduleMessage/listAfterScheduleMessages/ListAfterScheduleMessagesUseCase";

export class ListAfterScheduleMessagesController {
  constructor(
    private listAfterScheduleMessagesUseCase: ListAfterScheduleMessagesUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;

      const res = await this.listAfterScheduleMessagesUseCase.execute({
        userId: userId!,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
