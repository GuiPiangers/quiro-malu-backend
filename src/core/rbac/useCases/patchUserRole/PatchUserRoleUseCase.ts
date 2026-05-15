import type { IRbacRepository } from "../../../../repositories/rbac/IRbacRepository";
import { ApiError } from "../../../../utils/ApiError";

export class PatchUserRoleUseCase {
  constructor(private rbac: IRbacRepository) {}

  async execute(data: {
    actingClinicId: string;
    targetUserId: string;
    roleId: string;
  }): Promise<void> {
    const clinicId = await this.rbac.findUserClinicId(data.targetUserId);
    if (!clinicId) {
      throw new ApiError("Usuário não encontrado", 404, "user");
    }
    if (clinicId !== data.actingClinicId) {
      throw new ApiError("Usuário não pertence a esta clínica", 400, "user");
    }
    await this.rbac.setUserRole({
      userId: data.targetUserId,
      clinicId: data.actingClinicId,
      roleId: data.roleId,
    });
  }
}
