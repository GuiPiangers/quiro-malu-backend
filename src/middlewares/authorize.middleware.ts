import { NextFunction, Request, Response } from "express";
import type { PermissionKey } from "../database/seeds/permissions.seed";
import type { PermissionScope } from "../types/permissions";
import { ApiError } from "../utils/ApiError";
import { responseError } from "../utils/ResponseError";

export function authorize(requiredPermission: PermissionKey) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissions = req.user?.permissions ?? [];
      const granted = permissions.find((p) => p.key === requiredPermission);
      if (!granted) {
        throw new ApiError("Acesso negado.", 403, "forbidden");
      }
      const scope = (granted.scope ?? { type: "all" }) as PermissionScope;
      req.permissionScope = scope;
      next();
    } catch (err) {
      return responseError(res, err);
    }
  };
}
