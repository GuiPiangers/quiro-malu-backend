import { createMockFinanceRepository } from "../../../../repositories/_mocks/FinanceRepositoryMock";
import { DeleteFinanceUseCase } from "./deleteFinanceUseCase";

describe("DeleteFinanceUseCase", () => {
  let deleteFinanceUseCase: DeleteFinanceUseCase;

  const mockFinanceRepository = createMockFinanceRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    deleteFinanceUseCase = new DeleteFinanceUseCase(mockFinanceRepository);
  });

  describe("execute", () => {
    it("Should call repository delete method with correct arguments ", async () => {
      const userId = "test-user-id";
      const FinanceId = "test-Finance-id";

      await deleteFinanceUseCase.execute({
        userId,
        id: FinanceId,
      });

      expect(mockFinanceRepository.delete).toHaveBeenCalledWith({
        id: FinanceId,
        userId,
      });
      expect(mockFinanceRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("Should throw an Error if repository delete method throws ", async () => {
      const userId = "test-user-id";
      const FinanceId = "test-Finance-id";
      const errorMessage = "Error deleting Finance";

      mockFinanceRepository.delete.mockRejectedValue(new Error(errorMessage));

      await expect(
        deleteFinanceUseCase.execute({
          userId,
          id: FinanceId,
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
