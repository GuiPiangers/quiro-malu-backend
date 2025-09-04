import { EventSuggestion } from "../../models/EventSuggestion";
import { createMockEventSuggestionRepository } from "../../../../repositories/_mocks/EventSuggestionRepositoryMock";
import { ListEventSuggestionsUseCase } from "./ListEventSuggestionsUseCase";

describe("ListEventSuggestionsUseCase", () => {
  it("should return a list of event suggestions", async () => {
    const eventSuggestionRepository = createMockEventSuggestionRepository();
    const listEventSuggestionsUseCase = new ListEventSuggestionsUseCase(
      eventSuggestionRepository,
    );

    const suggestion1 = new EventSuggestion({
      description: "Test 1",
      durationInMinutes: 30,
      frequency: 1,
    });
    const suggestion2 = new EventSuggestion({
      description: "Test 2",
      durationInMinutes: 60,
      frequency: 2,
    });

    eventSuggestionRepository.list.mockResolvedValue([
      suggestion1,
      suggestion2,
    ]);

    const result = await listEventSuggestionsUseCase.execute({
      userId: "user-id",
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual(suggestion1.getDTO());
    expect(result.data[1]).toEqual(suggestion2.getDTO());
    expect(eventSuggestionRepository.list).toHaveBeenCalledWith({
      userId: "user-id",
    });
  });
});
