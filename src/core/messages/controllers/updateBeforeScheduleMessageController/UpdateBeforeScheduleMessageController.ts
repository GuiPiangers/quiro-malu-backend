import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import {
  UpdateBeforeScheduleMessageDTO,
  UpdateBeforeScheduleMessageUseCase,
} from "../../useCases/updateBeforeScheduleMessage/UpdateBeforeScheduleMessageUseCase";

export class UpdateBeforeScheduleMessageController {
  constructor(
    private updateBeforeScheduleMessageUseCase: UpdateBeforeScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;
      const { id } = request.params;
      const body = request.body as Omit<UpdateBeforeScheduleMessageDTO, "id" | "userId">;

      const res = await this.updateBeforeScheduleMessageUseCase.execute({
        ...body,
        id,
        userId: userId!,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
