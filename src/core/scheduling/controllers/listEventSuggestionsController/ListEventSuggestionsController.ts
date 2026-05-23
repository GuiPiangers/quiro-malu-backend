import { Request, Response } from 'express'
import { ListEventSuggestionsUseCase } from '../../useCases/listEventSuggestions/ListEventSuggestionsUseCase'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { ListEventSuggestionsQuerySchema } from '../schedulingSharedSchemas'

export class ListEventSuggestionsController {
  constructor(
    private listEventSuggestionsUseCase: ListEventSuggestionsUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListEventSuggestionsQuerySchema, request.query)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const userId = request.user.id
      const { filter } = parsed.data

      const result = await this.listEventSuggestionsUseCase.execute({
        userId: userId!,
        config: { filter },
      })

      return response.status(200).json(result)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
