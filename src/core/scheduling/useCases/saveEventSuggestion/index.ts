import { KnexEventSuggestionRepository } from "../../../../repositories/eventSuggestion/KnexEventSuggestionRepository";
import { SaveEventSuggestionUseCase } from "./SaveEventSuggestionUseCase";

const eventSuggestionRepository = new KnexEventSuggestionRepository();

const saveEventSuggestionUseCase = new SaveEventSuggestionUseCase(
  eventSuggestionRepository,
);

export { saveEventSuggestionUseCase };
