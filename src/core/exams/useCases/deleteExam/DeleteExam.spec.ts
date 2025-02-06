import { createMockExamRepository } from "../../../../repositories/_mocks/ExamRepositoryMock";
import { DeleteExamUseCase } from "./DeleteExamUseCase";

describe("DeleteExamUseCase", () => {
  let deleteExamUseCase: DeleteExamUseCase;
  const mockExamRepository = createMockExamRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2025-01-10T12:00:00Z").getTime());
    deleteExamUseCase = new DeleteExamUseCase(mockExamRepository);
  });
  describe("execute", () => {
    it("Should call repository update method with correct arguments to set as deleted", async () => {
      const userId = "test-user-id";
      const examId = "test-Exam-id";
      const patientId = "test-patient-id";

      await deleteExamUseCase.execute({
        userId,
        id: examId,
        patientId,
      });

      expect(mockExamRepository.update).toHaveBeenCalledWith({
        id: examId,
        userId,
        patientId,
        deleted: true,
        deletedDate: "2025-01-10",
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
        deleteExamUseCase.execute({
          patientId,
          userId,
          id: examId,
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
