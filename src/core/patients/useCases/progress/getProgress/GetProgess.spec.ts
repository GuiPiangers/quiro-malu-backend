import { mockProgressRepository } from "../../../../../repositories/_mocks/ProgressRepositoryMock";
import { ApiError } from "../../../../../utils/ApiError";
import { GetProgressUseCase } from "./GetProgressUseCase";

describe("getProgressUseCase", () => {
  let getProgressUseCase: GetProgressUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getProgressUseCase = new GetProgressUseCase(mockProgressRepository);
  });

  describe("execute", () => {
    it("should call the repository get method with the correct Params", async () => {
      const id = "test-Progress-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";

      mockProgressRepository.get.mockResolvedValue([{ id, patientId }]);

      await getProgressUseCase.execute({ id, userId, patientId });

      expect(mockProgressRepository.get).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.get).toHaveBeenCalledWith({
        id,
        userId,
        patientId,
      });
    });

    it("should return Progress data if it exists", async () => {
      const id = "test-Progress-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";
      const progressData = {
        patientId,
        id,
        actualProblem: "actualProblem",
        date: "2024-12-20T10:00",
        procedures: "procedures",
        schedulingId: "schedulingId",
        service: "service",
      };
      mockProgressRepository.get.mockResolvedValue([progressData]);

      const result = await getProgressUseCase.execute({
        id,
        userId,
        patientId,
      });

      expect(result).toEqual(progressData);
    });

    it("should throw an ApiError if progress not exists", async () => {
      const id = "test-Progress-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";

      mockProgressRepository.get.mockResolvedValue([]);

      const promiseResult = getProgressUseCase.execute({
        id,
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
      const id = "test-Progress-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";
      const errorMessage = "Failed to get Progress";

      mockProgressRepository.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        getProgressUseCase.execute({ id, userId, patientId }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
