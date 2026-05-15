import { ListSchedulingUseCase } from "../../useCases/listScheduling/ListSchedulingUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { ListSchedulesQuerySchema } from "../schedulingSharedSchemas";

/**
 * @deprecated Handler de `GET /schedules`. Preferir `ListEventsController` + `GET /events`
 * (use case `ListEventsUseCase`), que já retorna agendamentos com eventos de bloqueio juntos.
 * @see docs/SCHEDULING_EVENTS.md
 */
export class ListSchedulingController {
  constructor(private listSchedulingUseCase: ListSchedulingUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListSchedulesQuerySchema, request.query);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const { page, date } = parsed.data;
      const clinicId = request.user.clinicId as string;

      const scheduling = await this.listSchedulingUseCase.execute({
        clinicId,
        page,
        date,
      });
      response.status(200).json(scheduling);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
