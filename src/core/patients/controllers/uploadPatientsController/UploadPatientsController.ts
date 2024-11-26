import { UploadPatientsUseCase } from "../../useCases/uploadPatients/UploadPatientsUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";

export class UploadPatientsController {
  constructor(private uploadPatientUseCase: UploadPatientsUseCase) {}
  async handle(request: Request, response: Response) {
    try {
      const { file } = request;
      const userId = request.user.id;

      if (file?.buffer && userId) {
        const result = await this.uploadPatientUseCase.execute({
          buffer: file.buffer,
          userId,
        });

        return response.send(result).status(200);
      } else {
        response.send({ message: "Nenhum arquivo foi enviado" }).status(400);
      }
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
