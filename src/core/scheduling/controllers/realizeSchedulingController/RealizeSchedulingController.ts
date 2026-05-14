import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { RealizeSchedulingUseCase } from "../../useCases/realizeScheduling/realizeSchedulingUseCase";
import { RealizeSchedulingBodySchema } from "../schedulingSharedSchemas";

export class RealizeSchedulingController {
  constructor(private realizeSchedulingUseCase: RealizeSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(RealizeSchedulingBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const data = parsed.data;
      const clinicId = request.user.clinicId;

      await this.realizeSchedulingUseCase.execute({
        userId: clinicId!,
        patientId: data.patientId,
        schedulingId: data.id,
      });
      response.status(201).json({ message: "Consulta realizada com sucesso!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
