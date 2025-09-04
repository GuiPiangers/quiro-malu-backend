import {
  EventSuggestion,
  EventSuggestionDTO,
} from "../../models/EventSuggestion";
import { IEventSuggestionRepository } from "../../../../repositories/eventSuggestion/IEventSuggestionRepository";

export class SaveEventSuggestionUseCase {
  constructor(private eventSuggestionRepository: IEventSuggestionRepository) {}

  async execute(dto: EventSuggestionDTO, userId: string) {
    const existingSuggestion =
      await this.eventSuggestionRepository.getByDescription({
        description: dto.description,
        userId,
      });

    if (existingSuggestion) {
      existingSuggestion.incrementFrequency();

      await this.eventSuggestionRepository.update(existingSuggestion, userId);
    } else {
      const newSuggestion = new EventSuggestion(dto);
      await this.eventSuggestionRepository.save(newSuggestion, userId);
    }
  }
}
