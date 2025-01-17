import { Request, Response } from "express";
import { SaveExamUseCase } from "../useCases/SaveExamUseCase";
import { ApiError } from "../../../utils/ApiError";
import { responseError } from "../../../utils/ResponseError";

export class SaveExamController {
  constructor(private saveExamUseCase: SaveExamUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;
      const { patientId } = request.params as {
        patientId: string;
      };
      const file = request.file;

      if (!file) throw new ApiError("Nenhum arquivo enviado", 400);

      if (!userId) throw new ApiError("Acesso não autorizado", 401);

      await this.saveExamUseCase.execute({
        patientId,
        userId,
        file,
      });

      response.status(200).json({ message: "Exame salvo com sucesso" });
    } catch (error: any) {
      responseError(response, error);
    }
  }
}
