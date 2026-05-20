import { Clinician } from "../../../../clinician/models/Clinician";
import { createMockClinicianRepository } from "../../../../../repositories/_mocks/ClinicianRepositoryMock";
import { createMockUserRepository } from "../../../../../repositories/_mocks/UserRepositoryMock";
import { GetUserUseCase } from "../GetUserUseCase";

describe("GetUserUseCase", () => {
  const clinicId = "00000000-0000-4000-8000-000000000001";
  const userId = "aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee";
  const userRepository = createMockUserRepository();
  const clinicianRepository = createMockClinicianRepository();
  let useCase: GetUserUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetUserUseCase(userRepository, clinicianRepository);
  });

  it("returns kind user when not a clinician", async () => {
    userRepository.getById.mockResolvedValue([
      {
        id: userId,
        name: "Maria",
        email: "maria@teste.com",
        phone: "(51) 99999 9999",
        password:
          "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
        clinicId,
        roleId: "role-1",
      },
    ]);
    clinicianRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: userId, clinicId });

    expect(result).toEqual({
      kind: "user",
      id: userId,
      name: "Maria",
      email: "maria@teste.com",
      phone: "(51) 99999 9999",
      clinicId,
      roleId: "role-1",
    });
    expect(result).not.toHaveProperty("services");
  });

  it("returns kind clinician with services when profile exists", async () => {
    userRepository.getById.mockResolvedValue([
      {
        id: userId,
        name: "Dr. João",
        email: "joao@teste.com",
        phone: "(51) 98888 7777",
        password:
          "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
        clinicId,
        roleId: "role-1",
      },
    ]);
    clinicianRepository.findById.mockResolvedValue(
      new Clinician({
        id: userId,
        name: "Dr. João",
        email: "joao@teste.com",
        phone: "(51) 98888 7777",
        password:
          "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
        clinicId,
        roleId: "role-1",
        services: [{ id: "svc-1", name: "Sessão", value: 100, duration: 3600 }],
      }),
    );

    const result = await useCase.execute({ id: userId, clinicId });

    expect(result.kind).toBe("clinician");
    if (result.kind === "clinician") {
      expect(result.services).toHaveLength(1);
      expect(result.services[0].id).toBe("svc-1");
    }
    expect(result).not.toHaveProperty("password");
  });

  it("throws when user not found in clinic", async () => {
    userRepository.getById.mockResolvedValue([]);

    await expect(useCase.execute({ id: userId, clinicId })).rejects.toThrow(
      "Usuário não encontrado",
    );
    expect(clinicianRepository.findById).not.toHaveBeenCalled();
  });
});

export {};
