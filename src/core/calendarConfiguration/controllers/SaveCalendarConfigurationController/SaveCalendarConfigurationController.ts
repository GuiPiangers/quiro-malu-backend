import { Request, Response } from "express";
import { SaveCalendarConfigurationUseCase } from "../../useCases/saveCalendarConfiguration/SaveCalendarConfiguration";
import { responseError } from "../../../../utils/ResponseError";
import { DayConfiguration } from "../../models/CalendarConfiguration";
import { ApiError } from "../../../../utils/ApiError";

export class SaveCalendarConfigurationController {
  constructor(
    private saveCalendarConfigurationUseCase: SaveCalendarConfigurationUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;
      const body = request.body as {
        0?: DayConfiguration;
        1?: DayConfiguration;
        2?: DayConfiguration;
        3?: DayConfiguration;
        4?: DayConfiguration;
        5?: DayConfiguration;
        6?: DayConfiguration;
      };

      if (!userId) {
        throw new ApiError("Unauthorized", 401);
      }

      await this.saveCalendarConfigurationUseCase.execute({
        userId,
        ...body,
      });

      return response
        .status(200)
        .json({ message: "Calendar configuration saved successfully" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
