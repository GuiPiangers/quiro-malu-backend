import { Request, Response } from "express";
import { ApiError } from "../../../../utils/ApiError";
import { responseError } from "../../../../utils/ResponseError";
import { ListExamUseCase } from "../../useCases/ListExamUSeCase";

export class ListExamController {
  constructor(private listExamUseCase: ListExamUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;
      const { patientId } = request.params as {
        patientId: string;
        id: string;
      };

      if (!userId) throw new ApiError("Acesso não autorizado", 401);

      const exams = await this.listExamUseCase.execute({
        patientId,
        userId,
      });

      response.status(200).json(exams);
    } catch (error: any) {
      responseError(response, error);
    }
  }
}
