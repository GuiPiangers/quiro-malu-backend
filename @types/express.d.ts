import { UserDTO } from "../src/core/authentication/models/User";
import type { PermissionScope } from "../src/types/permissions";
import type { ResolvedPermission } from "../src/types/permissions";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<UserDTO> & {
        clinicId?: string;
        permissions?: ResolvedPermission[];
      };
      permissionScope?: PermissionScope;
    }
  }
}
