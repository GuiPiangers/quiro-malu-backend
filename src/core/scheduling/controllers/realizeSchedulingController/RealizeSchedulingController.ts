import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { RealizeSchedulingUseCase } from "../../useCases/realizeScheduling/realizeSchedulingUseCase";

export class UpdateSchedulingController {
  constructor(private realizeSchedulingUseCase: RealizeSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const data = request.body as {
        id: string;
        patientId: string;
      };
      const userId = request.user.id;

      await this.realizeSchedulingUseCase.execute({
        userId: userId!,
        patientId: data.patientId,
        schedulingId: data.id,
      });
      response.status(201).json({ message: "Consulta realizada com sucesso!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
