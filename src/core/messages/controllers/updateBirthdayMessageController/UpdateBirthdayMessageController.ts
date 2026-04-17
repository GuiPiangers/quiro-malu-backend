import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import {
  UpdateBirthdayMessageDTO,
  UpdateBirthdayMessageUseCase,
} from "../../useCases/birthdayMessage/updateBirthdayMessage/UpdateBirthdayMessageUseCase";

export class UpdateBirthdayMessageController {
  constructor(
    private updateBirthdayMessageUseCase: UpdateBirthdayMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const body = request.body as Omit<UpdateBirthdayMessageDTO, "id" | "userId">;
      const userId = request.user.id;

      const res = await this.updateBirthdayMessageUseCase.execute({
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
