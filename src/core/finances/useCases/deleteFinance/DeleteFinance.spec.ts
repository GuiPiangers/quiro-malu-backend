import { createMockFinanceRepository } from "../../../../repositories/_mocks/FinanceRepositoryMock";
import { DeleteFinanceUseCase } from "./deleteFinanceUseCase";

describe("DeleteFinanceUseCase", () => {
  let deleteFinanceUseCase: DeleteFinanceUseCase;

  const mockFinanceRepository = createMockFinanceRepository();

  beforeEach(() => {
    vi.clearAllMocks();
    deleteFinanceUseCase = new DeleteFinanceUseCase(mockFinanceRepository);
  });

  describe("execute", () => {
    it("Should call repository delete method with correct arguments ", async () => {
      const clinicId = "test-user-id";
      const FinanceId = "test-Finance-id";

      await deleteFinanceUseCase.execute({
        clinicId,
        id: FinanceId,
      });

      expect(mockFinanceRepository.delete).toHaveBeenCalledWith({
        id: FinanceId,
        clinicId,
      });
      expect(mockFinanceRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("Should throw an Error if repository delete method throws ", async () => {
      const clinicId = "test-user-id";
      const FinanceId = "test-Finance-id";
      const errorMessage = "Error deleting Finance";

      mockFinanceRepository.delete.mockRejectedValue(new Error(errorMessage));

      await expect(
        deleteFinanceUseCase.execute({
          clinicId,
          id: FinanceId,
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
