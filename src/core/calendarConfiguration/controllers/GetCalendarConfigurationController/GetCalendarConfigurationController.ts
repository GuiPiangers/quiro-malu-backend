import { Request, Response } from "express";
import { GetCalendarConfigurationUseCase } from "../../useCases/getCalendarConfiguration/GetCalendarConfiguration";
import { responseError } from "../../../../utils/ResponseError";

export class GetCalendarConfigurationController {
  constructor(
    private getCalendarConfigurationUseCase: GetCalendarConfigurationUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;

      const result = await this.getCalendarConfigurationUseCase.execute({
        userId,
      });

      return response.status(200).json(result);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
