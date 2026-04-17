import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { GetBirthdayMessageUseCase } from "../../useCases/birthdayMessage/getBirthdayMessage/GetBirthdayMessageUseCase";

export class GetBirthdayMessageController {
  constructor(private getBirthdayMessageUseCase: GetBirthdayMessageUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id!;

      const res = await this.getBirthdayMessageUseCase.execute({
        id,
        userId,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
