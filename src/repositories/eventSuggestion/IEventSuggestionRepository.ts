import { EventSuggestion } from "../../core/scheduling/models/EventSuggestion";

export interface IEventSuggestionRepository {
  save(eventSuggestion: EventSuggestion, userId: string): Promise<void>;
  list(params: {
    userId: string;
    config?: { filter?: string };
  }): Promise<EventSuggestion[]>;
}
