import { createMockServiceRepository } from "../../../../repositories/_mocks/ServiceRepositoryMock";
import { ServiceDTO } from "../../models/Service";
import { GetServiceUseCase } from "./GetServiceUseCase";

describe("getServiceUseCase", () => {
  let getServiceUseCase: GetServiceUseCase;

  const mockServiceRepository = createMockServiceRepository();

  beforeEach(() => {
    vi.clearAllMocks();
    getServiceUseCase = new GetServiceUseCase(mockServiceRepository);
  });

  describe("execute", () => {
    it("Should return service data", async () => {
      const clinicId = "test-user-id";
      const serviceId = "test-service-id";
      const serviceData: ServiceDTO = {
        duration: 3600,
        name: "Quiropraxia",
        value: 100,
      };

      mockServiceRepository.get.mockResolvedValue(serviceData);

      const result = await getServiceUseCase.execute({ id: serviceId, clinicId });

      expect(result).toEqual(serviceData);
    });

    it("Should call repository get method with correct arguments ", async () => {
      const clinicId = "test-user-id";
      const serviceId = "test-service-id";

      mockServiceRepository.get.mockResolvedValue({
        id: serviceId,
        duration: 3600,
        name: "Quiropraxia",
        value: 100,
      });

      await getServiceUseCase.execute({
        clinicId,
        id: serviceId,
      });

      expect(mockServiceRepository.get).toHaveBeenCalledWith({
        clinicId,
        id: serviceId,
      });
      expect(mockServiceRepository.get).toHaveBeenCalledTimes(1);
    });
  });

  it("Should throw an Error if repository get method throws", async () => {
    const clinicId = "test-user-id";
    const serviceId = "test-service-id";
    const errorMessage = "Error getting service";

    mockServiceRepository.get.mockRejectedValue(new Error(errorMessage));

    await expect(
      getServiceUseCase.execute({ id: serviceId, clinicId }),
    ).rejects.toThrow(errorMessage);
  });
});
