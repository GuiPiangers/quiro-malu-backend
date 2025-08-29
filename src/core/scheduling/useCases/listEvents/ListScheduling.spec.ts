import { createMockBlockScheduleRepository } from "../../../../repositories/_mocks/BlockScheduleRepositoryMock";
import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { ListEventsUseCase } from "./ListEventsUseCase";
import { BlockSchedule } from "../../models/BlockSchedule";
import { DateTime } from "../../../shared/Date";
import { SchedulingWithPatientDTO } from "../../models/SchedulingWithPatient";

describe("listEventsUseCase", () => {
  let listEventsUseCase: ListEventsUseCase;
  const mockSchedulingRepository = createMockSchedulingRepository();
  const mockBlockScheduleRepository = createMockBlockScheduleRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    listEventsUseCase = new ListEventsUseCase(
      mockSchedulingRepository,
      mockBlockScheduleRepository,
    );
  });

  describe("execute", () => {
    it("should return the data of events", async () => {
      const date = "2025-08-27";
      const userId = "1";
      const schedules: SchedulingWithPatientDTO[] = [
        {
          id: "1",
          date: "2025-08-27T09:00:00",
          patientId: "1",
          patient: "test",
          phone: "test",
        },
      ];
      const blockSchedules = [
        new BlockSchedule({
          id: "1",
          date: new DateTime("2025-08-27T10:00:00"),
          endDate: new DateTime("2025-08-27T11:00:00"),
        }),
      ];

      mockSchedulingRepository.list.mockResolvedValue(schedules);
      mockBlockScheduleRepository.listBetweenDates.mockResolvedValue(
        blockSchedules,
      );

      const result = await listEventsUseCase.execute({ date, userId });
      const expected = [...schedules, ...blockSchedules.map((b) => b.getDTO())];

      expect(result.data).toEqual(expected);
    });

    it("should short data of events", async () => {
      const userId = "1";
      const schedules: SchedulingWithPatientDTO[] = [
        {
          id: "1",
          date: "2025-08-27T12:00:00",
          patientId: "1",
          patient: "test",
          phone: "test",
        },
      ];
      const blockSchedules = [
        new BlockSchedule({
          id: "1",
          date: new DateTime("2025-08-27T10:00:00"),
          endDate: new DateTime("2025-08-27T11:00:00"),
        }),
      ];

      mockSchedulingRepository.list.mockResolvedValue(schedules);
      mockBlockScheduleRepository.listBetweenDates.mockResolvedValue(
        blockSchedules,
      );

      const result = await listEventsUseCase.execute({
        date: "2025-08-27",
        userId,
      });
      const expected = [...blockSchedules.map((b) => b.getDTO()), ...schedules];

      expect(result.data).toEqual(expected);
    });

    it("should call the repositories list methods with the correct params", async () => {
      const date = "2025-08-27T10:00:00";
      const userId = "1";
      const onlyDate = date.substring(0, 10);
      const startDate = new DateTime(`${onlyDate}T00:00`);
      const endDate = new DateTime(`${onlyDate}T23:59`);

      await listEventsUseCase.execute({ date, userId });

      expect(mockSchedulingRepository.list).toHaveBeenCalledWith({
        date,
        userId,
      });
      expect(mockBlockScheduleRepository.listBetweenDates).toHaveBeenCalledWith(
        {
          userId,
          startDate,
          endDate,
        },
      );
    });

    it("should propagate an error if the repository method list throws", async () => {
      const date = "2025-08-27T10:00:00";
      const userId = "1";
      const error = new Error("Error");

      mockSchedulingRepository.list.mockRejectedValue(error);

      await expect(listEventsUseCase.execute({ date, userId })).rejects.toThrow(
        error,
      );
    });
  });
});
