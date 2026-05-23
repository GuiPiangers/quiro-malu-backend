import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'
import type { RoleRow } from '../../../../repositories/rbac/IRbacRepository'

export class ListRolesUseCase {
  constructor(private rbac: IRbacRepository) {}

  async execute(clinicId: string): Promise<RoleRow[]> {
    return this.rbac.listRolesByClinic(clinicId)
  }
}
