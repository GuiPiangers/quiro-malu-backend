import { createMockBlockScheduleRepository } from "../../../../../repositories/_mocks/BlockScheduleRepositoryMock";
import { createMockSchedulingRepository } from "../../../../../repositories/_mocks/SchedulingRepositoryMock";
import { BlockSchedule } from "../../../models/BlockSchedule";
import { Scheduling } from "../../../models/Scheduling";
import { DateTime } from "../../../../shared/Date";
import { EditBlockScheduleUseCase } from "./editBlockScheduleUseCase";

describe("EditBlockScheduleUseCase", () => {
  let editBlockScheduleUseCase: EditBlockScheduleUseCase;
  let blockScheduleRepository: jest.Mocked<
    ReturnType<typeof createMockBlockScheduleRepository>
  >;
  let schedulingRepository: jest.Mocked<
    ReturnType<typeof createMockSchedulingRepository>
  >;

  beforeEach(() => {
    blockScheduleRepository = createMockBlockScheduleRepository();
    schedulingRepository = createMockSchedulingRepository();
    editBlockScheduleUseCase = new EditBlockScheduleUseCase(
      blockScheduleRepository,
      schedulingRepository,
    );
  });

  it("should edit a block schedule", async () => {
    const blockSchedule = new BlockSchedule({
      id: "1",
      date: new DateTime("2025-01-01T10:00:00"),
      endDate: new DateTime("2025-01-01T11:00:00"),
    });

    blockScheduleRepository.findById.mockResolvedValue(blockSchedule);
    blockScheduleRepository.listBetweenDates.mockResolvedValue([]);
    schedulingRepository.listBetweenDates.mockResolvedValue([]);

    await editBlockScheduleUseCase.execute(
      {
        id: "1",
        date: "2025-01-01T11:00:00",
        endDate: "2025-01-01T12:00:00",
      },
      "user-1",
    );

    expect(blockScheduleRepository.edit).toHaveBeenCalledWith(
      expect.any(BlockSchedule),
      "user-1",
    );
  });

  it("should not edit a block schedule if it overlaps with another schedule", async () => {
    const blockSchedule = new BlockSchedule({
      id: "1",
      date: new DateTime("2025-01-01T10:00:00"),
      endDate: new DateTime("2025-01-01T11:00:00"),
    });

    const existingSchedule = new Scheduling({
      id: "2",
      date: "2025-01-01T11:30:00",
      duration: 3600,
      patientId: "patient-1",
      service: "service-1",
    });

    blockScheduleRepository.findById.mockResolvedValue(blockSchedule);
    schedulingRepository.listBetweenDates.mockResolvedValue([existingSchedule]);

    await expect(
      editBlockScheduleUseCase.execute(
        {
          id: "1",
          date: "2025-01-01T11:00:00",
          endDate: "2025-01-01T12:00:00",
        },
        "user-1",
      ),
    ).rejects.toThrow(
      "O horário selecionado para o bloqueio está indisponível.",
    );
  });

  it("should not edit a block schedule if it overlaps with another block schedule", async () => {
    const blockSchedule = new BlockSchedule({
      id: "1",
      date: new DateTime("2025-01-01T10:00:00"),
      endDate: new DateTime("2025-01-01T11:00:00"),
    });

    const existingBlockSchedule = new BlockSchedule({
      id: "2",
      date: new DateTime("2025-01-01T11:30:00"),
      endDate: new DateTime("2025-01-01T12:30:00"),
    });

    blockScheduleRepository.findById.mockResolvedValue(blockSchedule);
    blockScheduleRepository.listBetweenDates.mockResolvedValue([
      existingBlockSchedule,
    ]);
    schedulingRepository.listBetweenDates.mockResolvedValue([]);

    await expect(
      editBlockScheduleUseCase.execute(
        {
          id: "1",
          date: "2025-01-01T11:00:00",
          endDate: "2025-01-01T12:00:00",
        },
        "user-1",
      ),
    ).rejects.toThrow(
      "O horário selecionado para o bloqueio está indisponível.",
    );
  });
});
