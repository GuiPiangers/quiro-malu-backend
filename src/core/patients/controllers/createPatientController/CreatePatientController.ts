import { CreatePatientUseCase } from "../../useCases/createPatient/CreatePatientUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { PatientWriteBodySchema } from "../patientSharedSchemas";

export class CreatePatientController {
  constructor(private createPatientUseCase: CreatePatientUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(PatientWriteBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const data = parsed.data;
      const clinicId = request.user.clinicId;

      const res = await this.createPatientUseCase.execute(data, clinicId!);
      response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
