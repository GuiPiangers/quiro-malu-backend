import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import {
  UpdateAfterScheduleMessageDTO,
  UpdateAfterScheduleMessageUseCase,
} from "../../useCases/afterScheduleMessage/updateAfterScheduleMessage/UpdateAfterScheduleMessageUseCase";

export class UpdateAfterScheduleMessageController {
  constructor(
    private updateAfterScheduleMessageUseCase: UpdateAfterScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const body = request.body as Omit<UpdateAfterScheduleMessageDTO, "id" | "userId">;
      const userId = request.user.id;

      const res = await this.updateAfterScheduleMessageUseCase.execute({
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
