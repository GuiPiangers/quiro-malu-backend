import { Request, Response } from "express";
import { SaveExamUseCase } from "../useCases/SaveExamUseCase";
import { ApiError } from "../../../utils/ApiError";
import { responseError } from "../../../utils/ResponseError";

export class SaveExamController {
  constructor(private saveExamUseCase: SaveExamUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;
      const { patientId, file } = request.body as {
        file: Express.Multer.File;
        patientId: string;
      };

      if (!userId) throw new ApiError("Acesso não autorizado", 401);

      await this.saveExamUseCase.execute({
        patientId,
        userId,
        file,
      });

      response.json({ message: "Exame salvo com sucesso" });
    } catch (error: any) {
      responseError(error, response);
    }
  }
}
