import { IBeforeScheduleMessageRepository } from "../messages/IBeforeScheduleMessageRepository";

export const createMockBeforeScheduleMessageRepository =
  (): jest.Mocked<IBeforeScheduleMessageRepository> => ({
    save: jest.fn(),
  });
