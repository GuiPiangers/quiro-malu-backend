import { Request, Response } from "express";
import { DeleteSchedulingUseCase } from "../../useCases/deleteScheduling/DeleteSchedulingUseCase";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class DeleteSchedulingController {
  constructor(private deleteSchedulingUseCase: DeleteSchedulingUseCase) {}
  async handle(request: Request, response: Response): Promise<void> {
    try {
      const userId = request.user.id;
      const { id } = request.body;

      if (!id) throw new ApiError("Deve ser informado o Id e o PatientId", 400);

      await this.deleteSchedulingUseCase.execute({ id, userId: userId! });

      response.json({ message: "Paciente deletado com sucesso!" });
    } catch (err: any) {
      responseError(response, err);
    }
  }
}
