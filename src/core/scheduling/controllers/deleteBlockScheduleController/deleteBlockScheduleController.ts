import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { DeleteBlockScheduleUseCase } from "../../useCases/blockScheduling/deleteBlockSchedule/deleteBlockSchedule";
import { ApiError } from "../../../../utils/ApiError";

export class DeleteBlockScheduleController {
  constructor(private deleteBlockScheduleUseCase: DeleteBlockScheduleUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id;

      if (!userId) throw new ApiError("Unauthorized", 401);

      await this.deleteBlockScheduleUseCase.execute({ id, userId });

      return response
        .status(200)
        .json({ message: "Evento deletado com sucesso!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
