import { mockServiceRepository } from "../../../../repositories/_mocks/ServiceRepositoryMock";
import { ServiceDTO } from "../../models/Service";
import { GetServiceUseCase } from "./GetServiceUseCase";

describe("getServiceUseCase", () => {
  let getServiceUseCase: GetServiceUseCase;

  describe("execute", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      getServiceUseCase = new GetServiceUseCase(mockServiceRepository);
    });

    it("Should return service data", async () => {
      const userId = "test-user-id";
      const serviceId = "test-service-id";
      const serviceData: ServiceDTO = {
        duration: 3600,
        name: "Quiropraxia",
        value: 100,
      };

      mockServiceRepository.get.mockResolvedValue([serviceData]);

      const result = await getServiceUseCase.execute({ id: serviceId, userId });

      expect(result).toEqual(serviceData);
    });

    it("Should call repository get method with correct arguments ", async () => {
      const userId = "test-user-id";
      const serviceId = "test-service-id";

      mockServiceRepository.get.mockResolvedValue([]);

      await getServiceUseCase.execute({
        userId,
        id: serviceId,
      });

      expect(mockServiceRepository.get).toHaveBeenCalledWith({
        userId,
        id: serviceId,
      });
      expect(mockServiceRepository.get).toHaveBeenCalledTimes(1);
    });
  });

  it("Should throw an Error if repository get method throws", async () => {
    const userId = "test-user-id";
    const serviceId = "test-service-id";
    const errorMessage = "Error getting service";

    mockServiceRepository.get.mockRejectedValue(new Error(errorMessage));

    await expect(
      getServiceUseCase.execute({ id: serviceId, userId }),
    ).rejects.toThrow(errorMessage);
  });
});
