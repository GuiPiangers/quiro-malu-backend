import { mockExamRepository } from "../../../../repositories/_mocks/ExamRepositoryMock";
import { RestoreExamUseCase } from "./RestoreExamUseCase";

describe("restoreExamUseCase", () => {
  let restoreExamUseCase: RestoreExamUseCase;

  describe("execute", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest
        .useFakeTimers()
        .setSystemTime(new Date("2025-01-10T12:00:00Z").getTime());
      restoreExamUseCase = new RestoreExamUseCase(mockExamRepository);
    });

    it("Should call repository update method with correct arguments to set as restored", async () => {
      const userId = "test-user-id";
      const examId = "test-Exam-id";
      const patientId = "test-patient-id";

      await restoreExamUseCase.execute({
        userId,
        id: examId,
        patientId,
      });

      expect(mockExamRepository.update).toHaveBeenCalledWith({
        id: examId,
        userId,
        patientId,
        deleted: false,
        deletedDate: null,
      });
      expect(mockExamRepository.update).toHaveBeenCalledTimes(1);
    });

    it("Should throw an Error if repository method throws", async () => {
      const userId = "test-user-id";
      const examId = "test-Exam-id";
      const patientId = "test-patient-id";

      const errorMessage = "Error deleting Exam";

      mockExamRepository.update.mockRejectedValue(new Error(errorMessage));

      await expect(
        restoreExamUseCase.execute({
          patientId,
          userId,
          id: examId,
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
