import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'
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

    if (role.isSystem) {
      throw new ApiError(
        'Não é permitido alterar um papel de sistema',
        400,
        'role',
      )
    }

    await this.rbac.updateRole(data)
  }
}
