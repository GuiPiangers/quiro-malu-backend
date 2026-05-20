import { Request, Response } from "express";
import { CreateClinicianBodySchema } from "./createClinicianSchemas";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { CreateClinicianUseCase } from "../../useCases/createClinician/CreateClinicianUseCase";

export class CreateClinicianController {
  constructor(private readonly createClinicianUseCase: CreateClinicianUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(CreateClinicianBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const clinicId = request.user.clinicId!;
      const created = await this.createClinicianUseCase.execute(
        parsed.data,
        clinicId,
      );
      return response.status(201).json(created);
    } catch (err: unknown) {
      return responseError(response, err);
    }
  }
}
