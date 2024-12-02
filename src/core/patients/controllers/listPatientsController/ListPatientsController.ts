import { Request, Response } from "express";
import { ListPatientsUseCase } from "../../useCases/listPatients/ListPatientsUseCase";
import { responseError } from "../../../../utils/ResponseError";

export class ListPatientsController {
  constructor(private listPatientsUseCase: ListPatientsUseCase) {}
  async handle(request: Request, response: Response): Promise<void> {
    try {
      const userId = request.user.id;
      const { page, search, orderBy, limit: _limit } = request.query;
      const limit = _limit ? (_limit === "all" ? _limit : +_limit) : undefined;

      const patients = await this.listPatientsUseCase.execute({
        userId: userId!,
        page: +page! as number,
        search: search ? JSON.parse(search as string) : { name: "" },
        orderBy: orderBy && JSON.parse(orderBy as string),
        limit,
      });
      response.json(patients);
    } catch (err: any) {
      responseError(response, err);
    }
  }
}
