import { IEventSuggestionRepository } from "../../../../repositories/eventSuggestion/IEventSuggestionRepository";

export class ListEventSuggestionsUseCase {
  constructor(private eventSuggestionRepository: IEventSuggestionRepository) {}

  async execute(userId: string) {
    const eventSuggestions = await this.eventSuggestionRepository.list(userId);

    const data = eventSuggestions.map((suggestion) => suggestion.getDTO());

    return { data };
  }
}
