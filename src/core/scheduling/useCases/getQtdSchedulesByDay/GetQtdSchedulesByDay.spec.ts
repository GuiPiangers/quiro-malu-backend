import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { GetQtdSchedulesByDay } from "./GetQtdSchedulesByDay";

describe("getQtdSchedulesByDayUseCase", () => {
  let getQtdSchedulesByDayUseCase: GetQtdSchedulesByDay;
  const mockSchedulingRepository = createMockSchedulingRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    getQtdSchedulesByDayUseCase = new GetQtdSchedulesByDay(
      mockSchedulingRepository,
    );
  });

  describe("execute", () => {
    it("should return the data of qtdSchedulesByDay", async () => {
      const userId = "test-user-id";
      const month = 1;
      const year = 2025;

      const qtdSchedulesByDayData = [
        { formattedDate: "2025-01-01", qtd: 1 },
        { formattedDate: "2025-01-02", qtd: 5 },
        { formattedDate: "2025-01-10", qtd: 3 },
      ];

      mockSchedulingRepository.qdtSchedulesByDay.mockResolvedValue(
        qtdSchedulesByDayData,
      );

      const result = await getQtdSchedulesByDayUseCase.execute({
        month,
        year,
        userId,
      });

      expect(result).toEqual([
        { date: "2025-01-01", qtd: 1 },
        { date: "2025-01-02", qtd: 5 },
        { date: "2025-01-10", qtd: 3 },
      ]);
    });

    it("should call the repository qdtSchedulesByDay method with the correct params", async () => {
      const userId = "test-user-id";
      const month = 1;
      const year = 2025;

      mockSchedulingRepository.qdtSchedulesByDay.mockResolvedValue([]);

      await getQtdSchedulesByDayUseCase.execute({ month, year, userId });

      expect(mockSchedulingRepository.qdtSchedulesByDay).toHaveBeenCalledTimes(
        1,
      );
      expect(mockSchedulingRepository.qdtSchedulesByDay).toHaveBeenCalledWith({
        month,
        year,
        userId,
      });
    });

    it("should propagate an error if the repository method qdtSchedulesByDay throws", async () => {
      const userId = "test-user-id";
      const errorMessage = "Failed to getQtdSchedulesByDay";
      const month = 1;
      const year = 2025;

      mockSchedulingRepository.qdtSchedulesByDay.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(
        getQtdSchedulesByDayUseCase.execute({ month, year, userId }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
