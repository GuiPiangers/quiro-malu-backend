import type { PermissionKey } from "../../database/seeds/permissions.seed";
import type { ResolvedPermission } from "../../types/permissions";

export type PermissionCatalogRow = {
  id: string;
  key: PermissionKey;
  module: string;
  action: string;
  description: string;
};

export type RoleRow = {
  id: string;
  clinicId: string;
  name: string;
  description: string;
  isSystem: boolean;
};

export type RolePermissionItem = {
  permissionKey: PermissionKey;
  scope: unknown | null;
};

export interface IRbacRepository {
  findResolvedPermissionsByUser(data: {
    userId: string;
    clinicId: string;
  }): Promise<ResolvedPermission[]>;

  findAllPermissionsCatalog(): Promise<PermissionCatalogRow[]>;

  listRolesByClinic(clinicId: string): Promise<RoleRow[]>;

  createRole(data: {
    clinicId: string;
    name: string;
    description?: string;
  }): Promise<RoleRow>;

  updateRole(data: {
    id: string;
    clinicId: string;
    name?: string;
    description?: string;
  }): Promise<void>;

  deleteRole(data: { id: string; clinicId: string }): Promise<void>;

  findRoleByIdForClinic(data: {
    id: string;
    clinicId: string;
  }): Promise<RoleRow | null>;

  listRolePermissions(data: {
    roleId: string;
    clinicId: string;
  }): Promise<RolePermissionItem[]>;

  replaceRolePermissions(data: {
    roleId: string;
    clinicId: string;
    items: RolePermissionItem[];
  }): Promise<void>;

  setUserRole(data: {
    userId: string;
    clinicId: string;
    roleId: string;
  }): Promise<void>;

  findUserClinicId(userId: string): Promise<string | null>;

  /** Garante o papel de sistema (Administrador) com todas as permissões para a clínica. */
  createClinicAdminRole(clinicId: string): Promise<string>;
}
