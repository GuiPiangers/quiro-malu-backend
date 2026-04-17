import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ListBeforeScheduleMessagesUseCase } from "../../useCases/beforeScheduleMessage/listBeforeScheduleMessages/ListBeforeScheduleMessagesUseCase";

export class ListBeforeScheduleMessagesController {
  constructor(private listBeforeScheduleMessagesUseCase: ListBeforeScheduleMessagesUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;
      const { page, limit } = request.query;

      const res = await this.listBeforeScheduleMessagesUseCase.execute({
        userId: userId!,
        page: page != null ? Number(page) : undefined,
        limit: limit != null ? Number(limit) : undefined,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
