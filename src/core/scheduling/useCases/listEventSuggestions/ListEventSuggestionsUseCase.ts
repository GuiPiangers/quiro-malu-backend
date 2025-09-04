import { IEventSuggestionRepository } from "../../../../repositories/eventSuggestion/IEventSuggestionRepository";

export class ListEventSuggestionsUseCase {
  constructor(private eventSuggestionRepository: IEventSuggestionRepository) {}

  async execute(params: { userId: string; config?: { filter?: string } }) {
    const eventSuggestions = await this.eventSuggestionRepository.list(params);

    const data = eventSuggestions.map((suggestion) => suggestion.getDTO());

    return { data };
  }
}
