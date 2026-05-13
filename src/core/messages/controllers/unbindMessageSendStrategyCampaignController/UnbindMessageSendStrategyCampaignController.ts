import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { UnbindMessageSendStrategyCampaignUseCase } from "../../useCases/messageSendStrategy/unbindMessageSendStrategyCampaign/UnbindMessageSendStrategyCampaignUseCase";
import { CampaignIdParamSchema } from "../messagesCommonSchemas";

export class UnbindMessageSendStrategyCampaignController {
  constructor(
    private readonly unbindMessageSendStrategyCampaignUseCase: UnbindMessageSendStrategyCampaignUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(CampaignIdParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }

    try {
      const { campaignId } = parsedParams.data;
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
