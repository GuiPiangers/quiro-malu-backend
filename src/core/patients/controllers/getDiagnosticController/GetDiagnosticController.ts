import { Request, Response } from "express";
import { GetDiagnosticUseCase } from "../../useCases/diagnostic/getDiagnostic/GetDiagnosticUseCase";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { PatientIdPathParamSchema } from "../patientSharedSchemas";

export class GetDiagnosticController {
  constructor(private listDiagnosticUseCase: GetDiagnosticUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(PatientIdPathParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }

    try {
      const userId = request.user.id;
      const { patientId } = parsedParams.data;
      const { diagnostic, treatmentPlan } =
        await this.listDiagnosticUseCase.execute(patientId, userId!);

      response.json({ diagnostic, treatmentPlan, patientId });
    } catch (err: any) {
      responseError(response, err);
    }
  }
}
