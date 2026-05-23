import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'

export class PatchUserRoleUseCase {
  constructor(private rbac: IRbacRepository) {}

  async execute(data: {
    clinicId: string
    userId: string
    roleId: string
  }): Promise<void> {
    await this.rbac.setUserRole({
      userId: data.userId,
      clinicId: data.clinicId,
      roleId: data.roleId,
    })
  }
}
