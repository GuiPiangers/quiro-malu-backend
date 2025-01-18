import { Request, Response } from "express";
import { ApiError } from "../../../../utils/ApiError";
import { responseError } from "../../../../utils/ResponseError";
import { GetExamUseCase } from "../../useCases/GetExamUSeCase";

export class GetExamController {
  constructor(private getExamUseCase: GetExamUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;
      const { patientId, id } = request.params as {
        patientId: string;
        id: string;
      };

      if (!userId) throw new ApiError("Acesso não autorizado", 401);
      if (!id) throw new ApiError("Nenhum paciente enviado", 400);

      const url = await this.getExamUseCase.execute({
        patientId,
        userId,
        id,
      });

      console.log(url);

      response.status(200).json({ url });
    } catch (error: any) {
      responseError(response, error);
    }
  }
}
