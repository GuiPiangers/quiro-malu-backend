import type { IUserRepository } from "../../../../repositories/user/IUserRepository";
import { ApiError } from "../../../../utils/ApiError";

/** Escopo da clínica só via `deleteByIdForClinic` — ver `docs/PROJECT_GUIDE.md` (Escopo por clínica). */
export class DeleteClinicUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: {
    actingUserId: string;
    clinicId: string;
    targetUserId: string;
  }): Promise<void> {
    if (data.targetUserId === data.actingUserId) {
      throw new ApiError(
        "Não é possível remover o próprio usuário",
        400,
        "user",
      );
    }

    const deleted = await this.userRepository.deleteByIdForClinic({
      id: data.targetUserId,
      clinicId: data.clinicId,
    });
    if (deleted === 0) {
      throw new ApiError("Usuário não encontrado", 404, "user");
    }
  }
}
