import type { IRbacRepository } from "../../../../repositories/rbac/IRbacRepository";
import type { RolePermissionItem } from "../../../../repositories/rbac/IRbacRepository";
import { ApiError } from "../../../../utils/ApiError";

export class ReplaceRolePermissionsUseCase {
  constructor(private rbac: IRbacRepository) {}

  async execute(data: {
    roleId: string;
    clinicId: string;
    items: RolePermissionItem[];
  }): Promise<void> {
    const role = await this.rbac.findRoleByIdForClinic({
      id: data.roleId,
      clinicId: data.clinicId,
    });
    if (!role) {
      throw new ApiError("Papel não encontrado", 404, "role");
    }
    if (role.isSystem) {
      throw new ApiError(
        "Não é permitido alterar permissões de um papel de sistema",
        400,
        "role",
      );
    }
    await this.rbac.replaceRolePermissions(data);
  }
}
