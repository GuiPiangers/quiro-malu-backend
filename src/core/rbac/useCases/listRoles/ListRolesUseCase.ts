import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'
import type { RoleRow } from '../../../../repositories/rbac/IRbacRepository'

export class ListRolesUseCase {
  constructor(private rbac: IRbacRepository) {}

  async execute(clinicId: string): Promise<RoleRow[]> {
    const roles = await this.rbac.listRolesByClinic(clinicId)
    return roles.map((role) => role.getDTO() as RoleRow)
  }
}
