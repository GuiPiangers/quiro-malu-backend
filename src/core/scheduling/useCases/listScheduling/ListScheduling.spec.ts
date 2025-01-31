import { mockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { SchedulingStatus } from "../../models/Scheduling";
import { ListSchedulingUseCase } from "./ListSchedulingUseCase";

describe("listSchedulingUseCase", () => {
  let listSchedulingUseCase: ListSchedulingUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    listSchedulingUseCase = new ListSchedulingUseCase(mockSchedulingRepository);
  });

  describe("execute", () => {
    it("should return the data of scheduling", async () => {
      const userId = "test-user-id";
      const id = "test-scheduling-id";

      const listSchedulingData = [
        {
          id,
          patientId: "test-patient-id",
          date: "2025-01-01T10:00",
          duration: 3600,
          service: "service",
          phone: "phone",
          patient: "Patient",
          status: "Atendido" as SchedulingStatus,
        },
      ];
      const date = "2025-01-01";

      mockSchedulingRepository.list.mockResolvedValue(listSchedulingData);
      mockSchedulingRepository.count.mockResolvedValue([{ total: 1 }]);

      const result = await listSchedulingUseCase.execute({ userId, date });

      expect(result).toEqual({
        total: 1,
        limit: 20,
        schedules: listSchedulingData,
      });
    });

    it("should call the repository list method with the correct params", async () => {
      const userId = "test-user-id";
      const id = "test-scheduling-id";
      const date = "2025-01-01";
      mockSchedulingRepository.list.mockResolvedValue([
        {
          id,
          patientId: "test-patient-id",
          date: "2025-01-01T10:00",
          patient: "Gustavo",
          phone: "55 9999 999",
        },
      ]);

      await listSchedulingUseCase.execute({ userId, date });

      expect(mockSchedulingRepository.list).toHaveBeenCalledTimes(1);
      expect(mockSchedulingRepository.list).toHaveBeenCalledWith({
        userId,
        date,
      });
    });

    it("should propagate an error if the repository method list throws", async () => {
      const userId = "test-user-id";
      const date = "2025-01-01";
      const errorMessage = "Failed to listQtdSchedulesByDay";

      mockSchedulingRepository.list.mockRejectedValue(new Error(errorMessage));

      await expect(
        listSchedulingUseCase.execute({ userId, date }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
