import { SetProgressUseCase } from "../../../useCases/progress/setProgress/SetProgressUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../../utils/zodValidation";
import { SetProgressBodySchema } from "../progressBodySchemas";

export class SetProgressController {
  constructor(private setProgressUseCase: SetProgressUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(SetProgressBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const data = parsed.data;
      const clinicId = request.user.clinicId!;

      const progress = await this.setProgressUseCase.execute({
        ...data,
        clinicId,
      });

      response.status(201).json(progress);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
