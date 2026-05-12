import { Request, Response } from "express";
import { DeletePatientUseCase } from "../../useCases/deletePatient/DeletePatientUseCase";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { DeletePatientBodySchema } from "./deletePatientsSchemas";

export class DeletePatientsController {
  constructor(private deletePatientsUseCase: DeletePatientUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(DeletePatientBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const userId = request.user.id;
      const { id: patientId } = parsed.data;
      await this.deletePatientsUseCase.execute(patientId, userId!);

      response.json({ message: "Paciente deletado com sucesso!" });
    } catch (err: any) {
      responseError(response, err);
    }
  }
}
