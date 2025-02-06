import { createMockProgressRepository } from "../../../../../repositories/_mocks/ProgressRepositoryMock";
import { ApiError } from "../../../../../utils/ApiError";
import { GetProgressBySchedulingUseCase } from "./GetProgressBySchedulingUseCase";

describe("getProgressBySchedulingUseCase", () => {
  let getProgressBySchedulingUseCase: GetProgressBySchedulingUseCase;
  const mockProgressRepository = createMockProgressRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    getProgressBySchedulingUseCase = new GetProgressBySchedulingUseCase(
      mockProgressRepository,
    );
  });

  describe("execute", () => {
    it("should call the repository getByScheduling method with the correct Params", async () => {
      const schedulingId = "test-scheduling-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";

      mockProgressRepository.getByScheduling.mockResolvedValue([
        { schedulingId, patientId },
      ]);

      await getProgressBySchedulingUseCase.execute({
        schedulingId,
        userId,
        patientId,
      });

      expect(mockProgressRepository.getByScheduling).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.getByScheduling).toHaveBeenCalledWith({
        schedulingId,
        userId,
        patientId,
      });
    });

    it("should return Progress data if it exists", async () => {
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
      mockProgressRepository.getByScheduling.mockResolvedValue([progressData]);

      const result = await getProgressBySchedulingUseCase.execute({
        schedulingId,
        userId,
        patientId,
      });

      expect(result).toEqual(progressData);
    });

    it("should throw an ApiError if progress not exists", async () => {
      const schedulingId = "test-scheduling-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";

      mockProgressRepository.getByScheduling.mockResolvedValue([]);

      const promiseResult = getProgressBySchedulingUseCase.execute({
        schedulingId,
        userId,
        patientId,
      });

      expect(promiseResult).rejects.toThrow(ApiError);

      expect(promiseResult).rejects.toMatchObject({
        message: "Evolução não encontrada",
        statusCode: 404,
        type: undefined,
      });
    });

    it("should propagate an error if the repository get method throws", async () => {
      const schedulingId = "test-scheduling-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";
      const errorMessage = "Failed to get Progress";

      mockProgressRepository.getByScheduling.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        getProgressBySchedulingUseCase.execute({
          schedulingId,
          userId,
          patientId,
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
