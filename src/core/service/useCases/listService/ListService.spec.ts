import { mockServiceRepository } from "../../../../repositories/_mocks/ServiceRepositoryMock";
import { ServiceDTO } from "../../models/Service";
import { ListServiceUseCase } from "./ListServiceUseCase";

describe("ListService", () => {
  let listServiceUseCase: ListServiceUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    listServiceUseCase = new ListServiceUseCase(mockServiceRepository);
  });

  it("should call the repository list and count method with the correct Params", async () => {
    const userId = "test-user-id";

    mockServiceRepository.list.mockResolvedValue([
      { duration: 3600, name: "Quiropraxia", value: 150 },
    ]);

    mockServiceRepository.count.mockResolvedValue([
      {
        total: 1,
      },
    ]);

    await listServiceUseCase.execute({
      userId,
      page: 1,
      search: "Quiropraxia",
    });

    expect(mockServiceRepository.list).toHaveBeenCalledTimes(1);
    expect(mockServiceRepository.list).toHaveBeenCalledWith({
      userId,
      config: { limit: 20, offSet: 0, search: "Quiropraxia" },
    });

    expect(mockServiceRepository.count).toHaveBeenCalledTimes(1);
    expect(mockServiceRepository.count).toHaveBeenCalledWith({
      userId,
    });
  });

  it("should update offset if page is provided", async () => {
    const userId = "test-user-id";

    mockServiceRepository.list.mockResolvedValue([
      { duration: 3600, name: "Quiropraxia", value: 150 },
    ]);

    mockServiceRepository.count.mockResolvedValue([
      {
        total: 1,
      },
    ]);

    await listServiceUseCase.execute({
      userId,
      page: 2,
    });

    expect(mockServiceRepository.list).toHaveBeenCalledTimes(1);
    expect(mockServiceRepository.list).toHaveBeenCalledWith({
      userId,
      config: { limit: 20, offSet: 20, search: undefined },
    });

    expect(mockServiceRepository.count).toHaveBeenCalledTimes(1);
    expect(mockServiceRepository.count).toHaveBeenCalledWith({
      userId,
    });
  });

  it("should call the repository list method without offset and limit if page is not provided", async () => {
    const userId = "test-user-id";

    mockServiceRepository.list.mockResolvedValue([
      { duration: 3600, name: "Quiropraxia", value: 150 },
    ]);

    mockServiceRepository.count.mockResolvedValue([
      {
        total: 1,
      },
    ]);

    await listServiceUseCase.execute({
      userId,
    });

    expect(mockServiceRepository.list).toHaveBeenCalledTimes(1);
    expect(mockServiceRepository.list).toHaveBeenCalledWith({
      userId,
      config: { search: undefined },
    });

    expect(mockServiceRepository.count).toHaveBeenCalledTimes(1);
    expect(mockServiceRepository.count).toHaveBeenCalledWith({
      userId,
    });
  });

  it("should return an object with total, limit and list of Service", async () => {
    const id = "test-Service-id";
    const userId = "test-user-id";

    const ServiceData: ServiceDTO = {
      id,
      duration: 3600,
      name: "Serviço 1",
      value: 150,
    };

    const serviceList = [
      ServiceData,
      { ...ServiceData, id: "test-Service-id-2", name: "Serviço 2" },
      { ...ServiceData, id: "test-Service-id-3", name: "Serviço 3" },
      { ...ServiceData, id: "test-Service-id-4", name: "Serviço 4" },
    ];

    mockServiceRepository.list.mockResolvedValue(serviceList);
    mockServiceRepository.count.mockResolvedValue([
      {
        total: serviceList.length,
      },
    ]);

    const result = await listServiceUseCase.execute({
      userId,
    });

    expect(result).toEqual({
      total: serviceList.length,
      limit: 20,
      services: serviceList,
    });
  });

  it("should propagate an error if the repository list method throws", async () => {
    const userId = "test-user-id";
    const errorMessage = "Failed to list Service";

    mockServiceRepository.list.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      listServiceUseCase.execute({
        userId,
      }),
    ).rejects.toThrow(errorMessage);
  });

  it("should propagate an error if the repository count method throws", async () => {
    const userId = "test-user-id";
    const errorMessage = "Failed to list Service";

    mockServiceRepository.count.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      listServiceUseCase.execute({
        userId,
      }),
    ).rejects.toThrow(errorMessage);
  });
});
