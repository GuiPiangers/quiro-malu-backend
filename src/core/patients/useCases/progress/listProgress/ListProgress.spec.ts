import { createMockProgressRepository } from "../../../../../repositories/_mocks/ProgressRepositoryMock";
import { ListProgressUseCase } from "./ListProgressUseCase";

describe("listProgressUseCase", () => {
  let listProgressUseCase: ListProgressUseCase;
  const mockProgressRepository = createMockProgressRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    listProgressUseCase = new ListProgressUseCase(mockProgressRepository);
  });

  describe("execute", () => {
    it("should call the repository list and count method with the correct Params", async () => {
      const schedulingId = "test-scheduling-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";

      mockProgressRepository.list.mockResolvedValue([
        { schedulingId, patientId },
      ]);

      mockProgressRepository.count.mockResolvedValue([
        {
          total: 1,
        },
      ]);

      await listProgressUseCase.execute({
        userId,
        patientId,
        page: 1,
      });

      expect(mockProgressRepository.list).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.list).toHaveBeenCalledWith({
        patientId,
        userId,
        config: { limit: 10, offSet: 0 },
      });

      expect(mockProgressRepository.count).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.count).toHaveBeenCalledWith({
        patientId,
        userId,
      });
    });

    it("should update offset if page is provided", async () => {
      const schedulingId = "test-scheduling-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";

      mockProgressRepository.list.mockResolvedValue([
        { schedulingId, patientId },
      ]);

      mockProgressRepository.count.mockResolvedValue([
        {
          total: 1,
        },
      ]);

      await listProgressUseCase.execute({
        userId,
        patientId,
        page: 2,
      });

      expect(mockProgressRepository.list).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.list).toHaveBeenCalledWith({
        patientId,
        userId,
        config: { limit: 10, offSet: 10 },
      });

      expect(mockProgressRepository.count).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.count).toHaveBeenCalledWith({
        patientId,
        userId,
      });
    });

    it("should set offset to 0 if page is not provided", async () => {
      const schedulingId = "test-scheduling-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";

      mockProgressRepository.list.mockResolvedValue([
        { schedulingId, patientId },
      ]);

      mockProgressRepository.count.mockResolvedValue([
        {
          total: 1,
        },
      ]);

      await listProgressUseCase.execute({
        userId,
        patientId,
      });

      expect(mockProgressRepository.list).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.list).toHaveBeenCalledWith({
        patientId,
        userId,
        config: { limit: 10, offSet: 0 },
      });

      expect(mockProgressRepository.count).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.count).toHaveBeenCalledWith({
        patientId,
        userId,
      });
    });

    it("should return an object with total, limit and list of progress", async () => {
      const id = "test-progress-id";
      const schedulingId = "test-scheduling-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";

      const progressData = {
        patientId,
        schedulingId,
        id,
        actualProblem: "actualProblem",
        date: "2024-12-20T10:00",
        procedures: "procedures",
        service: "service",
      };

      const progressList = [
        progressData,
        { ...progressData, id: "test-progress-id-2" },
        { ...progressData, id: "test-progress-id-3" },
        { ...progressData, id: "test-progress-id-4" },
      ];

      mockProgressRepository.list.mockResolvedValue(progressList);
      mockProgressRepository.count.mockResolvedValue([
        {
          total: progressList.length,
        },
      ]);

      const result = await listProgressUseCase.execute({
        userId,
        patientId,
      });

      expect(result).toEqual({
        total: progressList.length,
        limit: 10,
        progress: progressList,
      });
    });

    it("should propagate an error if the repository list method throws", async () => {
      const userId = "test-user-id";
      const patientId = "test-patient-id";
      const errorMessage = "Failed to list Progress";

      mockProgressRepository.list.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        listProgressUseCase.execute({
          userId,
          patientId,
        }),
      ).rejects.toThrow(errorMessage);
    });

    it("should propagate an error if the repository count method throws", async () => {
      const userId = "test-user-id";
      const patientId = "test-patient-id";
      const errorMessage = "Failed to list Progress";

      mockProgressRepository.count.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        listProgressUseCase.execute({
          userId,
          patientId,
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
