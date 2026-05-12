import { GetQtdSchedulesByDay } from "../../useCases/getQtdSchedulesByDay/GetQtdSchedulesByDay";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { QtdSchedulesQuerySchema } from "../schedulingSharedSchemas";

export class GetQtdSchedulesByDayController {
  constructor(private getQtdSchedulesUseCase: GetQtdSchedulesByDay) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(QtdSchedulesQuerySchema, request.query);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const { month, year } = parsed.data;
      const userId = request.user.id;

      const qtdSchedules = await this.getQtdSchedulesUseCase.execute({
        month,
        year,
        userId: userId!,
      });
      response.status(200).json(qtdSchedules);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}