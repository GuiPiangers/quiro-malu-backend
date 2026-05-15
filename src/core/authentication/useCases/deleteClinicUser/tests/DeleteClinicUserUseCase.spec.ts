import { createMockRbacRepository } from "../../../../../repositories/_mocks/RbacRepositoryMock";
import { createMockUserRepository } from "../../../../../repositories/_mocks/UserRepositoryMock";
import { ApiError } from "../../../../../utils/ApiError";
import { DeleteClinicUserUseCase } from "../DeleteClinicUserUseCase";

describe("DeleteClinicUserUseCase", () => {
  const userRepository = createMockUserRepository();
  const rbacRepository = createMockRbacRepository();
  let useCase: DeleteClinicUserUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new DeleteClinicUserUseCase(userRepository, rbacRepository);
  });

  it("remove usuário da clínica do token", async () => {
    rbacRepository.findUserClinicId.mockResolvedValue("clinic-1");
    userRepository.deleteByIdForClinic.mockResolvedValue(1);

    await useCase.execute({
      actingUserId: "actor",
      actingClinicId: "clinic-1",
      targetUserId: "target",
    });

    expect(userRepository.deleteByIdForClinic).toHaveBeenCalledWith({
      id: "target",
      clinicId: "clinic-1",
    });
  });

  it("rejeita remoção do próprio usuário", async () => {
    await expect(
      useCase.execute({
        actingUserId: "same",
        actingClinicId: "clinic-1",
        targetUserId: "same",
      }),
    ).rejects.toThrow(ApiError);
    expect(userRepository.deleteByIdForClinic).not.toHaveBeenCalled();
  });

  it("rejeita usuário de outra clínica", async () => {
    rbacRepository.findUserClinicId.mockResolvedValue("outra");

    await expect(
      useCase.execute({
        actingUserId: "actor",
        actingClinicId: "clinic-1",
        targetUserId: "target",
      }),
    ).rejects.toThrow(ApiError);
    expect(userRepository.deleteByIdForClinic).not.toHaveBeenCalled();
  });

  it("404 quando usuário não existe", async () => {
    rbacRepository.findUserClinicId.mockResolvedValue(null);

    await expect(
      useCase.execute({
        actingUserId: "actor",
        actingClinicId: "clinic-1",
        targetUserId: "missing",
      }),
    ).rejects.toThrow(ApiError);
  });
});
