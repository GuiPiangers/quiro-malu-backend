import { IEventSuggestionRepository } from '../../../../repositories/eventSuggestion/IEventSuggestionRepository'
import type { PermissionScope } from '../../../../types/permissions'
import { assertEventsScopeAccess } from '../../../../utils/eventsPermissionScope'

export class ListEventSuggestionsUseCase {
  constructor(private eventSuggestionRepository: IEventSuggestionRepository) {}

  async execute(params: {
    userId: string
    requestUserId: string
    eventsReadScope?: PermissionScope | null
    config?: { filter?: string }
  }) {
    assertEventsScopeAccess(params.userId, {
      requestUserId: params.requestUserId,
      eventsScope: params.eventsReadScope,
    })

    const eventSuggestions = await this.eventSuggestionRepository.list(params)

    const data = eventSuggestions.map((suggestion) => suggestion.getDTO())

    return { data }
  }
}
