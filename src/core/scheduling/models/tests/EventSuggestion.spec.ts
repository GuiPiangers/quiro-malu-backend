import { EventSuggestion } from "../EventSuggestion";

describe("EventSuggestion", () => {
  it("should create an EventSuggestion with a random id if not provided", () => {
    const eventSuggestion = new EventSuggestion({
      description: "Test Description",
      durationInMinutes: 30,
      frequency: 1,
    });

    expect(eventSuggestion.id).toBeDefined();
    expect(eventSuggestion.description).toBe("Test Description");
    expect(eventSuggestion.durationInMinutes).toBe(30);
    expect(eventSuggestion.frequency).toBe(1);
  });

  it("should create an EventSuggestion with the provided id", () => {
    const eventSuggestion = new EventSuggestion({
      id: "test-id",
      description: "Test Description",
      durationInMinutes: 30,
      frequency: 1,
    });

    expect(eventSuggestion.id).toBe("test-id");
  });

  it("should return a DTO", () => {
    const eventSuggestion = new EventSuggestion({
      id: "test-id",
      description: "Test Description",
      durationInMinutes: 30,
      frequency: 1,
    });

    const dto = eventSuggestion.getDTO();

    expect(dto).toEqual({
      id: "test-id",
      description: "Test Description",
      durationInMinutes: 30,
      frequency: 1,
    });
  });
});
