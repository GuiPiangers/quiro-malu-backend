import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { BindMessageSendStrategyCampaignsUseCase } from "../../useCases/messageSendStrategy/bindMessageSendStrategyCampaigns/BindMessageSendStrategyCampaignsUseCase";

export class BindMessageSendStrategyCampaignsController {
  constructor(
    private readonly bindMessageSendStrategyCampaignsUseCase: BindMessageSendStrategyCampaignsUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { campaignId } = request.params;
      const body = request.body as { strategyIds?: string[] };
      const userId = request.user.id!;

      await this.bindMessageSendStrategyCampaignsUseCase.execute({
        userId,
        campaignId,
        strategyIds: body.strategyIds ?? [],
      });

      return response.status(204).send();
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
