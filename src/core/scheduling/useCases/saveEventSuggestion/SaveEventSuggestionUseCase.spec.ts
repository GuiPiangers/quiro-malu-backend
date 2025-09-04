import {
  EventSuggestion,
  EventSuggestionDTO,
} from "../../models/EventSuggestion";
import { createMockEventSuggestionRepository } from "../../../../repositories/_mocks/EventSuggestionRepositoryMock";
import { SaveEventSuggestionUseCase } from "./SaveEventSuggestionUseCase";

describe("SaveEventSuggestionUseCase", () => {
  it("should create a new event suggestion if it does not exist", async () => {
    const eventSuggestionRepository = createMockEventSuggestionRepository();
    const saveEventSuggestionUseCase = new SaveEventSuggestionUseCase(
      eventSuggestionRepository,
    );

    const dto: EventSuggestionDTO = {
      description: "Test Description",
      durationInMinutes: 30,
      frequency: 1,
    };

    eventSuggestionRepository.getByDescription.mockResolvedValue(null);

    await saveEventSuggestionUseCase.execute(dto, "user-id");

    expect(eventSuggestionRepository.getByDescription).toHaveBeenCalledWith({
      description: "Test Description",
      userId: "user-id",
    });
    expect(eventSuggestionRepository.save).toHaveBeenCalledWith(
      expect.any(EventSuggestion),
      "user-id",
    );
    expect(eventSuggestionRepository.update).not.toHaveBeenCalled();
  });

  it("should update an existing event suggestion", async () => {
    const eventSuggestionRepository = createMockEventSuggestionRepository();
    const saveEventSuggestionUseCase = new SaveEventSuggestionUseCase(
      eventSuggestionRepository,
    );

    const existingSuggestion = new EventSuggestion({
      id: "existing-id",
      description: "Test Description",
      durationInMinutes: 30,
      frequency: 1,
    });

    const dto: EventSuggestionDTO = {
      description: "Test Description",
      durationInMinutes: 30,
      frequency: 1,
    };

    eventSuggestionRepository.getByDescription.mockResolvedValue(
      existingSuggestion,
    );

    await saveEventSuggestionUseCase.execute(dto, "user-id");

    expect(eventSuggestionRepository.getByDescription).toHaveBeenCalledWith({
      description: "Test Description",
      userId: "user-id",
    });
    expect(eventSuggestionRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        frequency: 2,
        durationInMinutes: 30,
      }),
      "user-id",
    );
    expect(eventSuggestionRepository.save).not.toHaveBeenCalled();
  });
});
