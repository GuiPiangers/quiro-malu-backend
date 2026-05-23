import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { BindMessageSendStrategyCampaignsUseCase } from '../../useCases/messageSendStrategy/bindMessageSendStrategyCampaigns/BindMessageSendStrategyCampaignsUseCase'
import { BindCampaignStrategiesBodySchema } from '../messageSendStrategyHttpSchemas'
import { CampaignIdParamSchema } from '../messagesCommonSchemas'

export class BindMessageSendStrategyCampaignsController {
  constructor(
    private readonly bindMessageSendStrategyCampaignsUseCase: BindMessageSendStrategyCampaignsUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(CampaignIdParamSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }
    const parsedBody = parseWithSchema(
      BindCampaignStrategiesBodySchema,
      request.body,
    )
    if (!parsedBody.success) {
      return sendZodBadRequest(response, parsedBody.error)
    }

    try {
      const { campaignId } = parsedParams.data
      const body = parsedBody.data
      const userId = request.user.id!

      await this.bindMessageSendStrategyCampaignsUseCase.execute({
        userId,
        campaignId,
        strategyIds: body.strategyIds ?? [],
      })

      return response.status(204).send()
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
