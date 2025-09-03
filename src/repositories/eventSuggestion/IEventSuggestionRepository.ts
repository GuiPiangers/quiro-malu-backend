import { EventSuggestion } from "../../core/scheduling/models/EventSuggestion";

export interface IEventSuggestionRepository {
  save(eventSuggestion: EventSuggestion, userId: string): Promise<void>;
  list(userId: string): Promise<EventSuggestion[]>;
}
