import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { ListEventsUseCase } from "../../useCases/listEvents/ListEventsUseCase";

export class ListEventsController {
  constructor(private listEventsUseCase: ListEventsUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { date } = request.query;
      const userId = request.user.id as string;

      if (!date) {
        throw new ApiError("Date is required");
      }

      const events = await this.listEventsUseCase.execute({
        date: date as string,
        userId,
      });

      response.status(200).json(events);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
