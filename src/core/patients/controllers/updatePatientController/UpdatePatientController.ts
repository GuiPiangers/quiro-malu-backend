import { Request, Response } from "express";
import { UpdatePatientUseCase } from "../../useCases/updatePatient/UpdatePatientUseCase";
import { Patient } from "../../models/Patient";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { PatientWriteBodySchema } from "../patientSharedSchemas";

export class UpdatePatientController {
  constructor(private updatePatientUseCase: UpdatePatientUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(PatientWriteBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const userId = request.user.clinicId;
      const patientData = parsed.data;
      const patient = new Patient(patientData);
      const patientDTO = patient.getPatientDTO();

      await this.updatePatientUseCase.execute(patientDTO, userId!);
      response.status(201).json({ message: "Atualizado com sucesso!" });
    } catch (err: any) {
      responseError(response, err);
    }
  }
}
