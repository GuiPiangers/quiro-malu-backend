import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { ListEventsUseCase } from "../../useCases/listEvents/ListEventsUseCase";
import { ListEventsQuerySchema } from "../schedulingSharedSchemas";

export class ListEventsController {
  constructor(private listEventsUseCase: ListEventsUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListEventsQuerySchema, request.query);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const { date } = parsed.data;
      const userId = request.user.id as string;
      const clinicId = request.user.clinicId as string;

      const events = await this.listEventsUseCase.execute({
        date,
        clinicId,
        userId,
      });

      response.status(200).json(events);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
