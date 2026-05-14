import { Request, Response } from "express";
import { ListPatientsUseCase } from "../../useCases/listPatients/ListPatientsUseCase";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { ListPatientsQuerySchema } from "./listPatientsSchemas";

export class ListPatientsController {
  constructor(private listPatientsUseCase: ListPatientsUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListPatientsQuerySchema, request.query);

    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const clinicId = request.user.clinicId;
      const { page, search, orderBy, limit } = parsed.data;

      const patients = await this.listPatientsUseCase.execute({
        clinicId: clinicId!,
        page,
        search,
        orderBy,
        limit,
      });

      response.json(patients);
    } catch (err: any) {
      responseError(response, err);
    }
  }
}
