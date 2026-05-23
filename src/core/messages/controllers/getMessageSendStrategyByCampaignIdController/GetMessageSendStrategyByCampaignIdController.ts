import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { GetMessageSendStrategyByCampaignIdUseCase } from '../../useCases/messageSendStrategy/getMessageSendStrategyByCampaignId/GetMessageSendStrategyByCampaignIdUseCase'
import { CampaignIdParamSchema } from '../messagesCommonSchemas'

export class GetMessageSendStrategyByCampaignIdController {
  constructor(
    private readonly getMessageSendStrategyByCampaignIdUseCase: GetMessageSendStrategyByCampaignIdUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(CampaignIdParamSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    try {
      const { campaignId } = parsedParams.data
      const userId = request.user.id!

      const res = await this.getMessageSendStrategyByCampaignIdUseCase.execute({
        userId,
        campaignId,
      })

      return response.status(200).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
