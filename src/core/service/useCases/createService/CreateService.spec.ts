import { createMockServiceRepository } from "../../../../repositories/_mocks/ServiceRepositoryMock";
import { ApiError } from "../../../../utils/ApiError";
import { ServiceDTO } from "../../models/Service";
import { CreateServiceUseCase } from "./CreateServiceUseCase";

describe("CreateServiceUseCase", () => {
  let createServiceUseCase: CreateServiceUseCase;
  const mockServiceRepository = createMockServiceRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    createServiceUseCase = new CreateServiceUseCase(mockServiceRepository);
  });

  describe("execute", () => {
    it("Should throw an ApiError if service name already exists", async () => {
      const userId = "test-user-id";
      const serviceData: ServiceDTO = {
        duration: 3600,
        name: "Quiropraxia",
        value: 100,
      };

      mockServiceRepository.getByName.mockResolvedValue([serviceData]);

      await expect(
        createServiceUseCase.execute({ ...serviceData, userId }),
      ).rejects.toThrow(ApiError);
    });

    it("Should call repository getByName method with correct arguments ", async () => {
      const userId = "test-user-id";
      const serviceData: ServiceDTO = {
        duration: 3600,
        name: "Quiropraxia",
        value: 100,
      };

      mockServiceRepository.getByName.mockResolvedValue([]);

      await createServiceUseCase.execute({
        ...serviceData,
        userId,
      });

      expect(mockServiceRepository.getByName).toHaveBeenCalledWith({
        name: serviceData.name,
        userId,
      });
      expect(mockServiceRepository.getByName).toHaveBeenCalledTimes(1);
    });

    it("Should call repository save method with correct arguments ", async () => {
      const userId = "test-user-id";
      const serviceData: ServiceDTO = {
        id: "test-service-id",
        duration: 3600,
        name: "Quiropraxia",
        value: 100,
      };

      mockServiceRepository.getByName.mockResolvedValue([]);

      await createServiceUseCase.execute({
        ...serviceData,
        userId,
      });

      expect(mockServiceRepository.save).toHaveBeenCalledWith({
        ...serviceData,
        userId,
      });
      expect(mockServiceRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
