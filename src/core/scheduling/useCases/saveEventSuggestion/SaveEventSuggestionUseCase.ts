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
      const updatedEventSuggestion = new EventSuggestion({
        ...existingSuggestion.getDTO(),
        durationInMinutes: dto.durationInMinutes,
      });

      updatedEventSuggestion.incrementFrequency();

      await this.eventSuggestionRepository.update(
        updatedEventSuggestion,
        userId,
      );
    } else {
      const newSuggestion = new EventSuggestion(dto);
      await this.eventSuggestionRepository.save(newSuggestion, userId);
    }
  }
}
