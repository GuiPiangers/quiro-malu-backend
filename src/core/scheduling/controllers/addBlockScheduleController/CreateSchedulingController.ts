import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { AddBlockSchedulingUseCase } from "../../useCases/blockScheduling/AddBlockSchedulingUseCase";

export class AddBlockScheduleController {
  constructor(private addBlockScheduleUseCase: AddBlockSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const data = request.body as {
        startDate: string;
        endDate: string;
        description?: string;
      };
      const userId = request.user.id as string;

      await this.addBlockScheduleUseCase.execute({
        ...data,
        userId,
      });

      response.status(201).json({ message: "Agenda bloqueada com sucesso!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
