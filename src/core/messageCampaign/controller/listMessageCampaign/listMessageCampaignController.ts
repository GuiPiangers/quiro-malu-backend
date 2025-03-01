import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { MessageCampaignDTO } from "../../models/MessageCampaign";
import { ListMessageCampaignUseCase } from "../../useCases/listMessageCampaign/listMessageCampaignUseCase";

export class ListMessageCampaignController {
  constructor(private listMessageCampaignUseCase: ListMessageCampaignUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user?.id;
      const { page } = request.query;

      if (!userId) throw new ApiError("O id deve ser informado", 401);

      const result = await this.listMessageCampaignUseCase.execute({
        userId,
        page: page ? +page : 1,
      });

      response.status(200).send(result);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
