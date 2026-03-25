import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import {
  CreateBeforeScheduleMessageDTO,
  CreateBeforeScheduleMessageUseCase,
} from "../../useCases/createBeforeScheduleMessage/CreateBeforeScheduleMessageUseCase";

export class CreateBeforeScheduleMessageController {
  constructor(private createBeforeScheduleMessageUseCase: CreateBeforeScheduleMessageUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const body = request.body as Omit<CreateBeforeScheduleMessageDTO, "userId">;
      const userId = request.user.id;

      const res = await this.createBeforeScheduleMessageUseCase.execute({
        ...body,
        userId: userId!,
      });

      return response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
