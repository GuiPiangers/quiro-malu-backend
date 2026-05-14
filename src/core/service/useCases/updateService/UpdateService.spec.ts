import { createMockServiceRepository } from "../../../../repositories/_mocks/ServiceRepositoryMock";
import { ApiError } from "../../../../utils/ApiError";
import { ServiceDTO } from "../../models/Service";
import { UpdateServiceUseCase } from "./UpdateServiceUseCase";

describe("updateServiceUseCase", () => {
  let updateServiceUseCase: UpdateServiceUseCase;
  const mockServiceRepository = createMockServiceRepository();

  beforeEach(() => {
    vi.clearAllMocks();
    updateServiceUseCase = new UpdateServiceUseCase(mockServiceRepository);
  });

  it("Should throw an ApiError if service name already exists and service id is different", async () => {
    const clinicId = "test-user-id";
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
        clinicId,
        id: "test-service-id-2",
      }),
    ).rejects.toThrow(ApiError);

    await expect(
      updateServiceUseCase.execute({
        ...serviceData,
        clinicId,
        id: "test-service-id-2",
      }),
    ).rejects.toThrow("Já existe um serviço cadastrado com esse nome");
  });

  it("Should throw an ApiError if id param is not defined", async () => {
    const clinicId = "test-user-id";
    const serviceData: ServiceDTO = {
      duration: 3600,
      name: "Quiropraxia",
      value: 100,
    };

    mockServiceRepository.getByName.mockResolvedValue([serviceData]);

    await expect(
      updateServiceUseCase.execute({ ...serviceData, clinicId }),
    ).rejects.toThrow(ApiError);

    await expect(
      updateServiceUseCase.execute({ ...serviceData, clinicId }),
    ).rejects.toThrow("O id deve ser informado");
  });

  it("Should call repository getByName method with correct arguments", async () => {
    const clinicId = "test-user-id";
    const serviceData: ServiceDTO = {
      id: "test-service-id",
      duration: 3600,
      name: "Quiropraxia",
      value: 100,
    };

    mockServiceRepository.getByName.mockResolvedValue([]);

    await updateServiceUseCase.execute({
      ...serviceData,
      clinicId,
    });

    expect(mockServiceRepository.getByName).toHaveBeenCalledWith({
      name: serviceData.name,
      clinicId,
    });
    expect(mockServiceRepository.getByName).toHaveBeenCalledTimes(1);
  });

  it("Should call repository update method with correct arguments", async () => {
    const clinicId = "test-user-id";
    const serviceData: ServiceDTO = {
      id: "test-service-id",
      duration: 3600,
      name: "Quiropraxia",
      value: 100,
    };

    mockServiceRepository.getByName.mockResolvedValue([]);

    await updateServiceUseCase.execute({
      ...serviceData,
      clinicId,
    });

    expect(mockServiceRepository.update).toHaveBeenCalledWith({
      ...serviceData,
      clinicId,
    });
    expect(mockServiceRepository.update).toHaveBeenCalledTimes(1);
  });
});
