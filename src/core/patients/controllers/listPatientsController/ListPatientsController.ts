import { Request, Response } from "express";
import { ListPatientsUseCase } from "../../useCases/listPatients/ListPatientsUseCase";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { ListPatientsQuerySchema } from "./listPatientsSchemas";

export class ListPatientsController {
  constructor(private listPatientsUseCase: ListPatientsUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListPatientsQuerySchema, request.query);

    console.log("PARSED", parsed);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const userId = request.user.id;
      const { page, search, orderBy, limit } = parsed.data;

      console.log("SEARCH", search);
      console.log("ORDER BY", orderBy);
      console.log("LIMIT", limit);

      const patients = await this.listPatientsUseCase.execute({
        userId: userId!,
        page,
        search,
        orderBy,
        limit,
      });

      console.log("PATIENTS", patients);

      response.json(patients);
    } catch (err: any) {
      responseError(response, err);
    }
  }
}
