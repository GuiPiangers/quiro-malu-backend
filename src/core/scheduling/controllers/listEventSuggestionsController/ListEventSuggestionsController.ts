import { Request, Response } from "express";
import { ListEventSuggestionsUseCase } from "../../useCases/listEventSuggestions/ListEventSuggestionsUseCase";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class ListEventSuggestionsController {
  constructor(
    private listEventSuggestionsUseCase: ListEventSuggestionsUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;
      const filter = request.query.filter as string | undefined;

      if (!userId) throw new ApiError("Unauthorized", 401);

      const result = await this.listEventSuggestionsUseCase.execute({
        userId,
        config: { filter },
      });

      return response.status(200).json(result);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
