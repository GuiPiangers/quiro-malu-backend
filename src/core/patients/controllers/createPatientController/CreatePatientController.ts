import { CreatePatientUseCase } from "../../useCases/createPatient/CreatePatientUseCase";
import { Request, Response } from "express";
import { PatientDTO } from "../../models/Patient";
import { responseError } from "../../../../utils/ResponseError";

export class CreatePatientController {
  constructor(private createPatientUseCase: CreatePatientUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const data = request.body as PatientDTO;
      const userId = request.user.id;

      const res = await this.createPatientUseCase.execute(data, userId!);
      response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
