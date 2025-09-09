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
        domingo?: DayConfiguration;
        segunda?: DayConfiguration;
        terca?: DayConfiguration;
        quarta?: DayConfiguration;
        quinta?: DayConfiguration;
        sexta?: DayConfiguration;
        sabado?: DayConfiguration;
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
