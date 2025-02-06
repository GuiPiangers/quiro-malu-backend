import { createMockFinanceRepository } from "../../../../repositories/_mocks/FinanceRepositoryMock";
import { ApiError } from "../../../../utils/ApiError";
import { FinanceDTO } from "../../models/Finance";
import { ListFinancesUseCase } from "./listFinancesUseCase";

describe("listFinanceUseCase", () => {
  let listFinancesUseCase: ListFinancesUseCase;

  const mockFinanceRepository = createMockFinanceRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    listFinancesUseCase = new ListFinancesUseCase(mockFinanceRepository);
  });

  describe("execute", () => {
    it("Should return Finance data", async () => {
      const userId = "test-user-id";
      const yearAndMonth = "2025-01";

      const financeData: FinanceDTO = {
        description: "Quiropraxia",
        value: 100,
        date: "2025/01/10",
        type: "expense",
        paymentMethod: "money",
      };

      mockFinanceRepository.list.mockResolvedValue([financeData]);

      const result = await listFinancesUseCase.execute({
        userId,
        yearAndMonth,
      });

      expect(result).toEqual([financeData]);
    });

    it("Should call repository list method with correct arguments ", async () => {
      const userId = "test-user-id";
      const yearAndMonth = "2025-01";
      const financeData: FinanceDTO = {
        description: "Quiropraxia",
        value: 100,
        date: "2025/01/10",
        type: "expense",
        paymentMethod: "money",
      };

      mockFinanceRepository.list.mockResolvedValue([financeData]);

      await listFinancesUseCase.execute({
        userId,
        yearAndMonth,
      });

      expect(mockFinanceRepository.list).toHaveBeenCalledWith({
        userId,
        yearAndMonth,
      });
      expect(mockFinanceRepository.list).toHaveBeenCalledTimes(1);
    });
  });

  it("Should throw an ApiError if yearAndDate param is invalid", async () => {
    const userId = "test-user-id";
    const yearAndMonth = "2025/01";

    await expect(
      listFinancesUseCase.execute({ userId, yearAndMonth }),
    ).rejects.toThrow(ApiError);

    await expect(
      listFinancesUseCase.execute({ userId, yearAndMonth }),
    ).rejects.toThrow(
      "Formato de yearAndMonth inválido. O formato deve ser YYYY-MM",
    );
  });

  it("Should throw an Error if repository list method throws", async () => {
    const userId = "test-user-id";
    const yearAndMonth = "2025-01";
    const errorMessage = "Error listing Finance";

    mockFinanceRepository.list.mockRejectedValue(new Error(errorMessage));

    await expect(
      listFinancesUseCase.execute({ userId, yearAndMonth }),
    ).rejects.toThrow(errorMessage);
  });
});
