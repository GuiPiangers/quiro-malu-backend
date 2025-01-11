import { Request, Response } from "express";
import { GetAnamnesisUseCase } from "../../useCases/anamesis/getAnamnesis/GetAnamnesisUseCase";
import { responseError } from "../../../../utils/ResponseError";

export class GetAnamnesisController {
  constructor(private listAnamnesisUseCase: GetAnamnesisUseCase) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      const userId = request.user.id;
      const { patientId } = request.params;

      const anamnesisData = await this.listAnamnesisUseCase.execute(
        patientId,
        userId!,
      );

      response.send(anamnesisData);
    } catch (err: any) {
      responseError(response, err);
    }
  }
}
