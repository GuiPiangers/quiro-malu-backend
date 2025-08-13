import { createMockBlockScheduleRepository } from "../../../../../repositories/_mocks/BlockScheduleRepositoryMock";
import { createMockSchedulingRepository } from "../../../../../repositories/_mocks/SchedulingRepositoryMock";
import { DateTime } from "../../../../shared/Date";
import { BlockSchedule } from "../../../models/BlockSchedule";
import { Scheduling } from "../../../models/Scheduling";

import {
  AddBlockSchedulingUseCase,
  AddBlockSchedulingDTO,
} from "./AddBlockSchedulingUseCase";

describe("AddBlockScheduleUseCase", () => {
  let addBlockSchedulingUseCase: AddBlockSchedulingUseCase;
  const mockBlockSchedulingRepository = createMockBlockScheduleRepository();
  const mockSchedulingRepository = createMockSchedulingRepository();

  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2025-01-10T12:00:00Z").getTime());
  });

  beforeEach(() => {
    jest.clearAllMocks();
    addBlockSchedulingUseCase = new AddBlockSchedulingUseCase(
      mockBlockSchedulingRepository,
      mockSchedulingRepository,
    );
  });

  it("Should call save method of BlockScheduleRepository with correct params", async () => {
    const blockSchedulingDTO: AddBlockSchedulingDTO = {
      startDate: "2025-01-01T10:00",
      endDate: "2025-01-01T11:00",
      description: "Descrição",
      userId: "userId",
    };

    await addBlockSchedulingUseCase.execute(blockSchedulingDTO);

    mockSchedulingRepository.listBetweenDates.mockResolvedValue([]);

    expect(mockBlockSchedulingRepository.save).toHaveBeenCalled();
    expect(mockBlockSchedulingRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Descrição",
        startDate: new DateTime("2025-01-01T10:00"),
        endDate: new DateTime("2025-01-01T11:00"),
      }),
      "userId",
    );
  });

  it("Should not save BlockSchedule if it overlaps with existing schedules", async () => {
    const blockSchedulingDTO: AddBlockSchedulingDTO = {
      startDate: "2025-01-01T10:00",
      endDate: "2025-01-01T11:00",
      description: "Descrição",
      userId: "userId",
    };

    mockSchedulingRepository.listBetweenDates.mockResolvedValue([
      new Scheduling({
        patientId: "patientId",
        date: "2025-01-01T10:00",
        duration: 60 * 60, // 1 hora
      }),
    ]);

    await expect(
      addBlockSchedulingUseCase.execute(blockSchedulingDTO),
    ).rejects.toThrow(
      "Existe agendamentos marcados no horário que deseja bloquear",
    );
  });

  it("Should not save BlockSchedule if it overlaps with existing blockSchedule", async () => {
    const blockSchedulingDTO: AddBlockSchedulingDTO = {
      startDate: "2025-01-01T10:00",
      endDate: "2025-01-01T11:00",
      description: "Descrição",
      userId: "userId",
    };

    mockSchedulingRepository.listBetweenDates.mockResolvedValue([]);
    mockBlockSchedulingRepository.listBetweenDates.mockResolvedValue([
      new BlockSchedule({
        endDate: new DateTime(blockSchedulingDTO.endDate),
        startDate: new DateTime(blockSchedulingDTO.startDate),
      }),
    ]);

    await expect(
      addBlockSchedulingUseCase.execute(blockSchedulingDTO),
    ).rejects.toThrow(
      "Existe agendamentos marcados no horário que deseja bloquear",
    );

    expect(mockBlockSchedulingRepository.save).not.toHaveBeenCalled();
  });
});
