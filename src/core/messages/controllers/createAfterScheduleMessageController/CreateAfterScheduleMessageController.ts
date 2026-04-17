import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import {
  CreateAfterScheduleMessageDTO,
  CreateAfterScheduleMessageUseCase,
} from "../../useCases/afterScheduleMessage/createAfterScheduleMessage/CreateAfterScheduleMessageUseCase";

export class CreateAfterScheduleMessageController {
  constructor(
    private createAfterScheduleMessageUseCase: CreateAfterScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const body = request.body as Omit<CreateAfterScheduleMessageDTO, "userId">;
      const userId = request.user.id;

      const res = await this.createAfterScheduleMessageUseCase.execute({
        ...body,
        userId: userId!,
      });

      return response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
