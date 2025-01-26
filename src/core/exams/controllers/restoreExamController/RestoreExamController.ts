import { Request, Response } from "express";
import { ApiError } from "../../../../utils/ApiError";
import { responseError } from "../../../../utils/ResponseError";
import { RestoreExamUseCase } from "../../useCases/RestoreExamUSeCase";

export class RestoreExamController {
  constructor(private restoreExamUseCase: RestoreExamUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;
      const { patientId, id } = request.params as {
        patientId: string;
        id: string;
      };

      if (!userId) throw new ApiError("Acesso não autorizado", 401);
      if (!patientId || !id)
        throw new ApiError("id ou patientId não estão definidos", 400);

      await this.restoreExamUseCase.execute({
        patientId,
        userId,
        id,
      });

      response.status(200).json({ message: "Exame restaurado com sucesso" });
    } catch (error: any) {
      responseError(response, error);
    }
  }
}
