import { ListEventSuggestionsUseCase } from "../../useCases/listEventSuggestions/ListEventSuggestionsUseCase";
import { ListEventSuggestionsController } from "./ListEventSuggestionsController";
import { knexEventSuggestionRepository } from "../../../../repositories/eventSuggestion/knexInstances";

const listEventSuggestionsUseCase = new ListEventSuggestionsUseCase(
  knexEventSuggestionRepository,
);
const listEventSuggestionsController = new ListEventSuggestionsController(
  listEventSuggestionsUseCase,
);

export { listEventSuggestionsController };