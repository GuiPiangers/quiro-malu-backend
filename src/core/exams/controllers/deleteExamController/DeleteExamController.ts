import { Request, Response } from "express";
import { ApiError } from "../../../../utils/ApiError";
import { responseError } from "../../../../utils/ResponseError";
import { DeleteExamUseCase } from "../../useCases/deleteExam/DeleteExamUseCase";

export class DeleteExamController {
  constructor(private deleteExamUseCase: DeleteExamUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;
      const { patientId, id } = request.params as {
        patientId: string;
        id: string;
      };

      if (!userId) throw new ApiError("Acesso não autorizado", 401);
      if (!id) throw new ApiError("Nenhum paciente enviado", 400);

      await this.deleteExamUseCase.execute({
        patientId,
        userId,
        id,
      });

      response.status(200).json({ message: "Exame deletado com sucesso" });
    } catch (error: any) {
      responseError(response, error);
    }
  }
}
