import { UploadPatientsUseCase } from "../../useCases/uploadPatients/UploadPatientsUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";

export class UploadPatientsController {
  constructor(private uploadPatientUseCase: UploadPatientsUseCase) {}
  async handle(request: Request, response: Response) {
    try {
      const { file } = request;
      const clinicId = request.user.clinicId!;
      if (file?.buffer && clinicId) {
        const result = await this.uploadPatientUseCase.execute({
          buffer: file.buffer,
          clinicId,
        });

        return response.status(200).send(result);
      }

      return response
        .status(400)
        .json({ message: "Nenhum arquivo foi enviado" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
