import { mockFinanceRepository } from "../../../../repositories/_mocks/FinanceRepositoryMock";
import { FinanceDTO } from "../../models/Finance";
import { GetFinanceBySchedulingUseCase } from "./getFinanceByScheduling";

describe("GetFinanceBySchedulingUseCase", () => {
  let getFinanceBySchedulingUseCase: GetFinanceBySchedulingUseCase;

  describe("execute", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      getFinanceBySchedulingUseCase = new GetFinanceBySchedulingUseCase(
        mockFinanceRepository,
      );
    });

    it("Should return Finance data", async () => {
      const userId = "test-user-id";
      const schedulingId = "test-scheduling-id";
      const FinanceData: FinanceDTO = {
        description: "Quiropraxia",
        value: 100,
        date: "2025/01/10",
        type: "expense",
        paymentMethod: "money",
        schedulingId,
      };

      mockFinanceRepository.getByScheduling.mockResolvedValue(FinanceData);

      const result = await getFinanceBySchedulingUseCase.execute({
        schedulingId,
        userId,
      });

      expect(result).toEqual(FinanceData);
    });

    it("Should call repository getByScheduling method with correct arguments ", async () => {
      const userId = "test-user-id";
      const schedulingId = "test-scheduling-id";
      const FinanceData: FinanceDTO = {
        description: "Quiropraxia",
        value: 100,
        date: "2025/01/10",
        type: "expense",
        paymentMethod: "money",
      };

      mockFinanceRepository.getByScheduling.mockResolvedValue(FinanceData);

      await getFinanceBySchedulingUseCase.execute({
        userId,
        schedulingId,
      });

      expect(mockFinanceRepository.getByScheduling).toHaveBeenCalledWith({
        userId,
        schedulingId,
      });
      expect(mockFinanceRepository.getByScheduling).toHaveBeenCalledTimes(1);
    });
  });

  it("Should throw an Error if repository get method throws", async () => {
    const userId = "test-user-id";
    const schedulingId = "test-scheduling-id";
    const errorMessage = "Error getting Finance";

    mockFinanceRepository.getByScheduling.mockRejectedValue(
      new Error(errorMessage),
    );

    await expect(
      getFinanceBySchedulingUseCase.execute({ schedulingId, userId }),
    ).rejects.toThrow(errorMessage);
  });
});
