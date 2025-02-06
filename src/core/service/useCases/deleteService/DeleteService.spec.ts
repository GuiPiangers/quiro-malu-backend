import { createMockServiceRepository } from "../../../../repositories/_mocks/ServiceRepositoryMock";
import { DeleteServiceUseCase } from "./DeleteServiceUseCase";

describe("DeleteServiceUseCase", () => {
  let deleteServiceUseCase: DeleteServiceUseCase;
  const mockServiceRepository = createMockServiceRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    deleteServiceUseCase = new DeleteServiceUseCase(mockServiceRepository);
  });
  describe("execute", () => {
    it("Should call repository delete method with correct arguments ", async () => {
      const userId = "test-user-id";
      const serviceId = "test-service-id";

      await deleteServiceUseCase.execute({
        userId,
        id: serviceId,
      });

      expect(mockServiceRepository.delete).toHaveBeenCalledWith({
        id: serviceId,
        userId,
      });
      expect(mockServiceRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("Should throw an Error if repository delete method throws ", async () => {
      const userId = "test-user-id";
      const serviceId = "test-service-id";
      const errorMessage = "Error deleting service";

      mockServiceRepository.delete.mockRejectedValue(new Error(errorMessage));

      await expect(
        deleteServiceUseCase.execute({
          userId,
          id: serviceId,
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
