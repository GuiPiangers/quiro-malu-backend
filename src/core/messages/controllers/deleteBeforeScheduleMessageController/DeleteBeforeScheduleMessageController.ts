import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { DeleteBeforeScheduleMessageUseCase } from "../../useCases/deleteBeforeScheduleMessage/DeleteBeforeScheduleMessageUseCase";

export class DeleteBeforeScheduleMessageController {
  constructor(
    private deleteBeforeScheduleMessageUseCase: DeleteBeforeScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;
      const { id } = request.params;

      await this.deleteBeforeScheduleMessageUseCase.execute({
        id,
        userId: userId!,
      });

      return response.status(204).send();
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
