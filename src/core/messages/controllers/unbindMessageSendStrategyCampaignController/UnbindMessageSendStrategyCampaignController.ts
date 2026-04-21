import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { UnbindMessageSendStrategyCampaignUseCase } from "../../useCases/messageSendStrategy/unbindMessageSendStrategyCampaign/UnbindMessageSendStrategyCampaignUseCase";

export class UnbindMessageSendStrategyCampaignController {
  constructor(
    private readonly unbindMessageSendStrategyCampaignUseCase: UnbindMessageSendStrategyCampaignUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { campaignId } = request.params;
      const userId = request.user.id!;

      await this.unbindMessageSendStrategyCampaignUseCase.execute({
        userId,
        campaignId,
      });

      return response.status(204).send();
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
