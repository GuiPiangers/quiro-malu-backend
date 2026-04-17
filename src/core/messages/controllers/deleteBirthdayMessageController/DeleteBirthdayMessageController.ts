import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { DeleteBirthdayMessageUseCase } from "../../useCases/birthdayMessage/deleteBirthdayMessage/DeleteBirthdayMessageUseCase";

export class DeleteBirthdayMessageController {
  constructor(
    private deleteBirthdayMessageUseCase: DeleteBirthdayMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id!;

      await this.deleteBirthdayMessageUseCase.execute({ id, userId });

      return response.status(200).json({ message: "Mensagem de aniversário deletada com sucesso" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
