import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { BindMessageSendStrategyCampaignsUseCase } from "../../useCases/messageSendStrategy/bindMessageSendStrategyCampaigns/BindMessageSendStrategyCampaignsUseCase";

export class BindMessageSendStrategyCampaignsController {
  constructor(
    private readonly bindMessageSendStrategyCampaignsUseCase: BindMessageSendStrategyCampaignsUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const body = request.body as { campaignIds?: string[] };
      const userId = request.user.id!;

      await this.bindMessageSendStrategyCampaignsUseCase.execute({
        userId,
        strategyId: id,
        campaignIds: body.campaignIds ?? [],
      });

      return response.status(204).send();
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
