import type { IRbacRepository } from "../../../../repositories/rbac/IRbacRepository";
import type { IUserRepository } from "../../../../repositories/user/IUserRepository";
import { ApiError } from "../../../../utils/ApiError";

export class DeleteClinicUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly rbacRepository: IRbacRepository,
  ) {}

  async execute(data: {
    actingUserId: string;
    actingClinicId: string;
    targetUserId: string;
  }): Promise<void> {
    if (data.targetUserId === data.actingUserId) {
      throw new ApiError(
        "Não é possível remover o próprio usuário",
        400,
        "user",
      );
    }

    const clinicId = await this.rbacRepository.findUserClinicId(
      data.targetUserId,
    );
    if (!clinicId || clinicId !== data.actingClinicId) {
      throw new ApiError("Usuário não encontrado", 404, "user");
    }

    const deleted = await this.userRepository.deleteByIdForClinic({
      id: data.targetUserId,
      clinicId: data.actingClinicId,
    });
    if (deleted === 0) {
      throw new ApiError("Usuário não encontrado", 404, "user");
    }
  }
}
