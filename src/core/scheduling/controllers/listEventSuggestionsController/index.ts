import { KnexEventSuggestionRepository } from "../../../../repositories/eventSuggestion/KnexEventSuggestionRepository";
import { ListEventSuggestionsUseCase } from "../../useCases/listEventSuggestions/ListEventSuggestionsUseCase";
import { ListEventSuggestionsController } from "./ListEventSuggestionsController";

const knexEventSuggestionRepository = new KnexEventSuggestionRepository();
const listEventSuggestionsUseCase = new ListEventSuggestionsUseCase(
  knexEventSuggestionRepository,
);
const listEventSuggestionsController = new ListEventSuggestionsController(
  listEventSuggestionsUseCase,
);

export { listEventSuggestionsController };
