import {
  EventSuggestion,
  EventSuggestionDTO,
} from "../../core/scheduling/models/EventSuggestion";

export interface IEventSuggestionRepository {
  save(eventSuggestion: EventSuggestion, userId: string): Promise<void>;
  list(params: {
    userId: string;
    config?: { filter?: string };
  }): Promise<EventSuggestion[]>;
  getByDescription(params: {
    description: string;
    userId: string;
  }): Promise<EventSuggestion | null>;
  update(eventSuggestion: EventSuggestion, userId: string): Promise<void>;
}
