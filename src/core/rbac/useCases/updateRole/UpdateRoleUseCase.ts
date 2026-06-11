import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'
import { Role } from '../../models/Role'
import { ApiError } from '../../../../utils/ApiError'

export class UpdateRoleUseCase {
  constructor(private rbac: IRbacRepository) {}

  async execute(data: {
    id: string
    clinicId: string
    name?: string
    description?: string
  }): Promise<void> {
    const role = await this.rbac.findRoleByIdForClinic({
      id: data.id,
      clinicId: data.clinicId,
    })

    if (!role) {
      throw new ApiError('Papel não encontrado', 404, 'role')
    }

    role.assertCanBeChanged()

    const updatedRole = new Role({
      ...role.getDTO(),
      name: data.name ?? role.name,
      description: data.description ?? role.description,
    })

    await this.rbac.updateRole({
      id: updatedRole.id,
      clinicId: updatedRole.clinicId,
      name:
        data.name === undefined
          ? undefined
          : updatedRole.name,
      description:
        data.description === undefined
          ? undefined
          : updatedRole.description,
    })
  }
}
