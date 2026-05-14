import { createMockClinicRepository } from "../../../../../repositories/_mocks/ClinicRepositoryMock";
import { ApiError } from "../../../../../utils/ApiError";
import { CreateClinicUseCase } from "../CreateClinicUseCase";

describe("CreateClinicUseCase", () => {
  const clinicRepository = createMockClinicRepository();
  let createClinicUseCase: CreateClinicUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    createClinicUseCase = new CreateClinicUseCase(clinicRepository);
  });

  it("should create clinic", async () => {
    clinicRepository.findByName.mockResolvedValue(null);

    const clinic = await createClinicUseCase.execute({
      name: "Clínica Teste",
    });

    expect(clinic).toHaveProperty("id");
    expect(clinicRepository.save).toHaveBeenCalledTimes(1);
  });

  it("should reject duplicated clinic name", async () => {
    clinicRepository.findByName.mockResolvedValue({
      id: "clinic-id",
      name: "Clínica Teste",
      getDTO: () => ({ id: "clinic-id", name: "Clínica Teste" }),
    } as any);

    await expect(
      createClinicUseCase.execute({ name: "Clínica Teste" }),
    ).rejects.toThrow(ApiError);
  });
});
