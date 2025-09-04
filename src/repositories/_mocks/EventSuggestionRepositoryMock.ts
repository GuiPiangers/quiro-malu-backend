import { IEventSuggestionRepository } from "../eventSuggestion/IEventSuggestionRepository";

export const createMockEventSuggestionRepository =
  (): jest.Mocked<IEventSuggestionRepository> => ({
    save: jest.fn(),
    list: jest.fn(),
    getByDescription: jest.fn(),
    update: jest.fn(),
  });
