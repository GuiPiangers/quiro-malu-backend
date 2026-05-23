import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'
import type { PermissionCatalogRow } from '../../../../repositories/rbac/IRbacRepository'

export class ListSystemPermissionsUseCase {
  constructor(private rbac: IRbacRepository) {}

  async execute(): Promise<PermissionCatalogRow[]> {
    return this.rbac.findAllPermissionsCatalog()
  }
}
