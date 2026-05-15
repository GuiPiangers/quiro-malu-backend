import { createMockUserRepository } from "../../../../../repositories/_mocks/UserRepositoryMock";
import { ListClinicUsersUseCase } from "../ListClinicUsersUseCase";

describe("ListClinicUsersUseCase", () => {
  const userRepository = createMockUserRepository();
  let useCase: ListClinicUsersUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ListClinicUsersUseCase(userRepository);
  });

  it("lista usuários da clínica", async () => {
    const items = [
      {
        id: "u1",
        name: "Ana",
        email: "ana@exemplo.com",
        phone: "51999999999",
        clinicId: "c1",
        roleId: "r1",
      },
    ];
    userRepository.listByClinicId.mockResolvedValue(items);

    const result = await useCase.execute("c1");

    expect(result).toEqual(items);
    expect(userRepository.listByClinicId).toHaveBeenCalledWith({
      clinicId: "c1",
    });
  });
});
