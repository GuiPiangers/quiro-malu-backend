import { IEventSuggestionRepository } from "../eventSuggestion/IEventSuggestionRepository";
import type { Mocked } from "vitest";

export const createMockEventSuggestionRepository =
  (): Mocked<IEventSuggestionRepository> => ({
    save: vi.fn(),
    list: vi.fn(),
    getByDescription: vi.fn(),
    update: vi.fn(),
  });
