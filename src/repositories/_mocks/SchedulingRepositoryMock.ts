import { ISchedulingRepository } from "../scheduling/ISchedulingRepository";
import type { Mocked } from "vitest";

export const createMockSchedulingRepository =
  (): Mocked<ISchedulingRepository> => ({
    count: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    listIdsByUserId: vi.fn(),
    listPatientIdsByUserIdOrderBySchedulingCountDesc: vi.fn(),
    list: vi.fn(),
    qdtSchedulesByDay: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    listBetweenDates: vi.fn(),
    listFromNowWithinMinutes: vi.fn(),
    listScheduledInMinutes: vi.fn(),
    listUpcoming: vi.fn(),
  });
