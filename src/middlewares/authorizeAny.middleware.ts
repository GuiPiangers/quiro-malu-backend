/* eslint-disable no-restricted-syntax */

import { NextFunction, Request, Response } from 'express'
import type { PermissionKey } from '../database/seeds/permissions.seed'
import { ApiError } from '../utils/ApiError'
import { responseError } from '../utils/ResponseError'

export function authorizeAny(...requiredPermissions: PermissionKey[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissions = req.user?.permissions ?? []
      const granted = requiredPermissions.some((key) =>
        permissions.some((permission) => permission.key === key),
      )

      if (!granted) {
        throw new ApiError('Acesso negado.', 403, 'forbidden')
      }

      next()
    } catch (err) {
      return responseError(res, err)
    }
  }
}
