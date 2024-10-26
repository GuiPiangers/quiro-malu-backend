import { SetAnamnesisUseCase } from "../../useCases/anamesis/setAnamnesis/SetAnamnesisUseCase";
import { Request, Response } from "express";
import { AnamnesisDTO } from "../../models/Anamnesis";
import { responseError } from "../../../../utils/ResponseError";

export class SetAnamnesisController {
  constructor(private setAnamnesisUseCase: SetAnamnesisUseCase) {}
  async handle(request: Request, response: Response) {
    try {
      const data = request.body as AnamnesisDTO;
      const userId = request.user.id;

      await this.setAnamnesisUseCase.execute(data, userId!);
      response.status(201).json({ message: "Criado com sucesso!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
