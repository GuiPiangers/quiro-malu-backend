import { Request, Response } from "express";
import { DeleteSchedulingUseCase } from "../../useCases/deleteScheduling/DeleteSchedulingUseCase";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { DeleteSchedulingBodySchema } from "../schedulingSharedSchemas";

export class DeleteSchedulingController {
  constructor(private deleteSchedulingUseCase: DeleteSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(DeleteSchedulingBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const userId = request.user.id;
      const { id } = parsed.data;

      await this.deleteSchedulingUseCase.execute({ id, userId: userId! });

      response.json({ message: "Paciente deletado com sucesso!" });
    } catch (err: any) {
      responseError(response, err);
    }
  }
}
