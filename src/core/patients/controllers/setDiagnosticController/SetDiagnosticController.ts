import { SetDiagnosticUseCase } from "../../useCases/diagnostic/setDiagnostic/SetDiagnosticUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { SetDiagnosticBodySchema } from "./diagnosticBodySchemas";

export class SetDiagnosticController {
  constructor(private setDiagnosticUseCase: SetDiagnosticUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(SetDiagnosticBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const data = parsed.data;
      const clinicId = request.user.clinicId;

      await this.setDiagnosticUseCase.execute(data, clinicId!);
      response.status(201).json({ message: "Criado com sucesso!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
