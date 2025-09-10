import { Request, Response } from "express";
import { GetCalendarConfigurationUseCase } from "../../useCases/getCalendarConfiguration/GetCalendarConfiguration";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class GetCalendarConfigurationController {
  constructor(
    private getCalendarConfigurationUseCase: GetCalendarConfigurationUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;

      if (!userId) throw new ApiError("Unauthorized", 401);

      const result = await this.getCalendarConfigurationUseCase.execute({
        userId,
      });

      if (!result) throw new ApiError("Configuração não encontrada", 404);

      return response.status(200).json(result);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
