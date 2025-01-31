import { mockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { DeleteSchedulingUseCase } from "./DeleteSchedulingUseCase";

describe("DeleteSchedulingUseCase", () => {
  let deleteSchedulingUseCase: DeleteSchedulingUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteSchedulingUseCase = new DeleteSchedulingUseCase(
      mockSchedulingRepository,
    );
  });

  describe("execute", () => {
    it("should call the repository delete method with the correct params", async () => {
      const id = "test-Scheduling-id";
      const userId = "test-user-id";

      await deleteSchedulingUseCase.execute({ id, userId });

      expect(mockSchedulingRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockSchedulingRepository.delete).toHaveBeenCalledWith({
        id,
        userId,
      });
    });

    it("should propagate an error if the repository delete method throws", async () => {
      const id = "test-Scheduling-id";
      const userId = "test-user-id";
      const errorMessage = "Failed to delete Scheduling";

      mockSchedulingRepository.delete.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        deleteSchedulingUseCase.execute({ id, userId }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
