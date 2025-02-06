import { createMockServiceRepository } from "../../../../repositories/_mocks/ServiceRepositoryMock";
import { ApiError } from "../../../../utils/ApiError";
import { ServiceDTO } from "../../models/Service";
import { UpdateServiceUseCase } from "./UpdateServiceUseCase";

describe("updateServiceUseCase", () => {
  let updateServiceUseCase: UpdateServiceUseCase;
  const mockServiceRepository = createMockServiceRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    updateServiceUseCase = new UpdateServiceUseCase(mockServiceRepository);
  });

  it("Should throw an ApiError if service name already exists and service id is different", async () => {
    const userId = "test-user-id";
    const serviceData: ServiceDTO = {
      id: "test-service-id",
      duration: 3600,
      name: "Quiropraxia",
      value: 100,
    };

    mockServiceRepository.getByName.mockResolvedValue([serviceData]);

    await expect(
      updateServiceUseCase.execute({
        ...serviceData,
        userId,
        id: "test-service-id-2",
      }),
    ).rejects.toThrow(ApiError);

    await expect(
      updateServiceUseCase.execute({
        ...serviceData,
        userId,
        id: "test-service-id-2",
      }),
    ).rejects.toThrow("Já existe um serviço cadastrado com esse nome");
  });

  it("Should throw an ApiError if id param is not defined", async () => {
    const userId = "test-user-id";
    const serviceData: ServiceDTO = {
      duration: 3600,
      name: "Quiropraxia",
      value: 100,
    };

    mockServiceRepository.getByName.mockResolvedValue([serviceData]);

    await expect(
      updateServiceUseCase.execute({ ...serviceData, userId }),
    ).rejects.toThrow(ApiError);

    await expect(
      updateServiceUseCase.execute({ ...serviceData, userId }),
    ).rejects.toThrow("O id deve ser informado");
  });

  it("Should call repository getByName method with correct arguments", async () => {
    const userId = "test-user-id";
    const serviceData: ServiceDTO = {
      id: "test-service-id",
      duration: 3600,
      name: "Quiropraxia",
      value: 100,
    };

    mockServiceRepository.getByName.mockResolvedValue([]);

    await updateServiceUseCase.execute({
      ...serviceData,
      userId,
    });

    expect(mockServiceRepository.getByName).toHaveBeenCalledWith({
      name: serviceData.name,
      userId,
    });
    expect(mockServiceRepository.getByName).toHaveBeenCalledTimes(1);
  });

  it("Should call repository update method with correct arguments", async () => {
    const userId = "test-user-id";
    const serviceData: ServiceDTO = {
      id: "test-service-id",
      duration: 3600,
      name: "Quiropraxia",
      value: 100,
    };

    mockServiceRepository.getByName.mockResolvedValue([]);

    await updateServiceUseCase.execute({
      ...serviceData,
      userId,
    });

    expect(mockServiceRepository.update).toHaveBeenCalledWith({
      ...serviceData,
      userId,
    });
    expect(mockServiceRepository.update).toHaveBeenCalledTimes(1);
  });
});
