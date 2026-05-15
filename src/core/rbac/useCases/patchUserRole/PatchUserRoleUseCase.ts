import type { IRbacRepository } from "../../../../repositories/rbac/IRbacRepository";

export class PatchUserRoleUseCase {
  constructor(private rbac: IRbacRepository) {}

  async execute(data: {
    actingClinicId: string;
    targetUserId: string;
    roleId: string;
  }): Promise<void> {
    await this.rbac.setUserRole({
      userId: data.targetUserId,
      clinicId: data.actingClinicId,
      roleId: data.roleId,
    });
  }
}
