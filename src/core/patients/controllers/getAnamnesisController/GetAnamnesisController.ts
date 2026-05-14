import { Request, Response } from "express";
import { GetAnamnesisUseCase } from "../../useCases/anamesis/getAnamnesis/GetAnamnesisUseCase";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { PatientIdPathParamSchema } from "../patientSharedSchemas";

export class GetAnamnesisController {
  constructor(private listAnamnesisUseCase: GetAnamnesisUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(PatientIdPathParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }

    try {
      const userId = request.user.clinicId;
      const { patientId } = parsedParams.data;

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
