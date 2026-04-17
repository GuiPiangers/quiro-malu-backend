import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import {
  CreateBirthdayMessageDTO,
  CreateBirthdayMessageUseCase,
} from "../../useCases/birthdayMessage/createBirthdayMessage/CreateBirthdayMessageUseCase";

export class CreateBirthdayMessageController {
  constructor(
    private createBirthdayMessageUseCase: CreateBirthdayMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const body = request.body as Omit<CreateBirthdayMessageDTO, "userId">;
      const userId = request.user.id;

      const res = await this.createBirthdayMessageUseCase.execute({
        ...body,
        userId: userId!,
      });

      return response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
