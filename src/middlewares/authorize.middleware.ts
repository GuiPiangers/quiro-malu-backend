/* eslint-disable no-restricted-syntax */

import { NextFunction, Request, Response } from 'express'
import type { PermissionKey } from '../database/seeds/permissions.seed'
import { normalizePermissionScope } from '../utils/eventsPermissionScope'
import { ApiError } from '../utils/ApiError'
import { responseError } from '../utils/ResponseError'

export function authorize(requiredPermission: PermissionKey) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissions = req.user?.permissions ?? []
      const granted =
        permissions.find((permission) => permission.key === requiredPermission)
      if (!granted) {
        throw new ApiError('Acesso negado.', 403, 'forbidden')
      }
      const scope = normalizePermissionScope(granted.scope)
      req.permissionScope = scope
      next()
    } catch (err) {
      return responseError(res, err)
    }
  }
}
