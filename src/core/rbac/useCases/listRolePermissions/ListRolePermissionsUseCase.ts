import type { IRbacRepository } from "../../../../repositories/rbac/IRbacRepository";
import type { RolePermissionItem } from "../../../../repositories/rbac/IRbacRepository";
import { ApiError } from "../../../../utils/ApiError";

export class ListRolePermissionsUseCase {
  constructor(private rbac: IRbacRepository) {}

  async execute(data: {
    roleId: string;
    clinicId: string;
  }): Promise<RolePermissionItem[]> {
    const role = await this.rbac.findRoleByIdForClinic({
      id: data.roleId,
      clinicId: data.clinicId,
    });
    if (!role) {
      throw new ApiError("Papel não encontrado", 404, "role");
    }
    return this.rbac.listRolePermissions(data);
  }
}
