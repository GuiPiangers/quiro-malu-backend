import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ListMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/listMessageSendStrategy/ListMessageSendStrategyUseCase";

export class ListMessageSendStrategyController {
  constructor(
    private readonly listMessageSendStrategyUseCase: ListMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id!;
      const { page, limit } = request.query;

      const res = await this.listMessageSendStrategyUseCase.execute({
        userId,
        page: page != null ? Number(page) : undefined,
        limit: limit != null ? Number(limit) : undefined,
      });
      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
