import type {
  IRbacRepository,
  RolePermissionItem,
} from '../../../../repositories/rbac/IRbacRepository'
import type { IClinicianRepository } from '../../../../repositories/clinician/IClinicianRepository'
import type { PermissionKey } from '../../../../database/seeds/permissions.seed'
import { ApiError } from '../../../../utils/ApiError'
import { PermissionScopeSchema } from '../../schemas/permissionScopeSchemas'

const EVENTS_PERMISSION_KEYS = new Set<PermissionKey>([
  'events:read',
  'events:write',
])

export class ReplaceRolePermissionsUseCase {
  constructor(
    private rbac: IRbacRepository,
    private clinicianRepository: IClinicianRepository,
  ) {}

  async execute(data: {
    roleId: string
    clinicId: string
    items: RolePermissionItem[]
  }): Promise<void> {
    const role = await this.rbac.findRoleByIdForClinic({
      id: data.roleId,
      clinicId: data.clinicId,
    })
    if (!role) {
      throw new ApiError('Papel não encontrado', 404, 'role')
    }
    if (role.isSystem) {
      throw new ApiError(
        'Não é permitido alterar permissões de um papel de sistema',
        400,
        'role',
      )
    }

    const normalizedItems = await Promise.all(
      data.items.map((item) => this.validateItem(item, data.clinicId)),
    )

    await this.rbac.replaceRolePermissions({
      ...data,
      items: normalizedItems,
    })
  }

  private async validateItem(
    item: RolePermissionItem,
    clinicId: string,
  ): Promise<RolePermissionItem> {
    if (item.scope === undefined || item.scope === null) {
      return { ...item, scope: null }
    }

    const parsedScope = PermissionScopeSchema.safeParse(item.scope)
    if (!parsedScope.success) {
      throw new ApiError('Escopo de permissão inválido', 400, 'scope')
    }

    if (
      EVENTS_PERMISSION_KEYS.has(item.permissionKey) &&
      parsedScope.data.type === 'list'
    ) {
      await this.validateClinicianUserIds(clinicId, parsedScope.data.userIds)
    }

    return {
      permissionKey: item.permissionKey,
      scope: parsedScope.data,
    }
  }

  private async validateClinicianUserIds(
    clinicId: string,
    userIds: string[],
  ): Promise<void> {
    const uniqueUserIds = [...new Set(userIds)]
    if (uniqueUserIds.length === 0) return

    const foundIds = await this.clinicianRepository.findClinicianIdsInClinic({
      clinicId,
      userIds: uniqueUserIds,
    })
    const foundSet = new Set(foundIds)

    for (const userId of uniqueUserIds) {
      if (!foundSet.has(userId)) {
        throw new ApiError(
          `O usuário ${userId} não é um clínico desta clínica`,
          400,
          'scope',
        )
      }
    }
  }
}
