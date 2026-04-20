import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { GetMessageSendStrategyByCampaignIdUseCase } from "../../useCases/messageSendStrategy/getMessageSendStrategyByCampaignId/GetMessageSendStrategyByCampaignIdUseCase";

export class GetMessageSendStrategyByCampaignIdController {
  constructor(
    private readonly getMessageSendStrategyByCampaignIdUseCase: GetMessageSendStrategyByCampaignIdUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { campaignId } = request.params;
      const userId = request.user.id!;

      const res = await this.getMessageSendStrategyByCampaignIdUseCase.execute({
        userId,
        campaignId,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
