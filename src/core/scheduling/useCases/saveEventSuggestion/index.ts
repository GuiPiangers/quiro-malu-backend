import { SaveEventSuggestionUseCase } from "./SaveEventSuggestionUseCase";
import { knexEventSuggestionRepository } from "../../../../repositories/eventSuggestion/knexInstances";

const eventSuggestionRepository = knexEventSuggestionRepository;

const saveEventSuggestionUseCase = new SaveEventSuggestionUseCase(
  eventSuggestionRepository,
);

export { saveEventSuggestionUseCase };