import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { createMessageCampaignUseCase } from "../../useCases/createMessageCampaign/createMessageCampaignUseCase";
import { MessageCampaignDTO } from "../../models/MessageCampaign";

export class CreateMessageCampaignController {
  constructor(
    private createMessageCampaignUseCase: createMessageCampaignUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user?.id;
      const data = request.body as MessageCampaignDTO;

      if (!userId) throw new ApiError("O id deve ser informado", 401);

      const notifications = await this.createMessageCampaignUseCase.execute({
        userId,
        ...data,
      });

      response.send(notifications);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
