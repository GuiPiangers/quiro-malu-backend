import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { DeleteAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/deleteAfterScheduleMessage/DeleteAfterScheduleMessageUseCase";

export class DeleteAfterScheduleMessageController {
  constructor(
    private deleteAfterScheduleMessageUseCase: DeleteAfterScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id!;

      await this.deleteAfterScheduleMessageUseCase.execute({ id, userId });

      return response.status(200).json({ message: "Mensagem de agendamento deletada com sucesso" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
