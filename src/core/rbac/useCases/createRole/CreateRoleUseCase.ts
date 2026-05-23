import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'
import type { RoleRow } from '../../../../repositories/rbac/IRbacRepository'
import { ApiError } from '../../../../utils/ApiError'

export class CreateRoleUseCase {
  constructor(private rbac: IRbacRepository) {}

  async execute(data: {
    clinicId: string;
    name: string;
    description?: string;
  }): Promise<RoleRow> {
    const existing = await this.rbac.listRolesByClinic(data.clinicId)
    const normalized = data.name.trim().toLowerCase()
    if (existing.some((r) => r.name.trim().toLowerCase() === normalized)) {
      throw new ApiError('Já existe um papel com este nome', 400, 'role')
    }
    return this.rbac.createRole({
      clinicId: data.clinicId,
      name: data.name,
      description: data.description,
    })
  }
}
