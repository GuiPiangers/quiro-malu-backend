import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateRequestFingerprint } from "../core/authentication/utils/generateRequestFingerprint";
import { validateUserFingerprintUseCase } from "../core/authentication/useCases/userFingerprint";
import { knexRbacRepository } from "../repositories/rbac/knexInstances";
import type { ResolvedPermission } from "../types/permissions";
import { ApiError } from "../utils/ApiError";
import { parseJwtPermissions } from "../utils/parseJwtPermissions";
import { responseError } from "../utils/ResponseError";
import * as dotenv from "dotenv";
dotenv.config();

type JwtPayload = {
  id: string;
  clinicId: string;
  permissions?: unknown;
};

export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) throw new ApiError("Acesso não autorizado", 401);
    const token = authorization.split(" ")[1];
    if (!token) throw new ApiError("Acesso não autorizado", 401);

    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET!);
    const payload = verifyToken as unknown as JwtPayload;

    const userId = payload.id;
    const clinicId = payload.clinicId;
    if (!userId || !clinicId) {
      throw new ApiError("Acesso não autorizado", 401);
    }

    const fpHash = generateRequestFingerprint(request);
    const fingerprintOk = await validateUserFingerprintUseCase.execute({
      userId,
      fpHash,
    });
    if (!fingerprintOk) {
      throw new ApiError("Dispositivo não reconhecido", 418);
    }

    const permissionsFromJwt = parseJwtPermissions(payload.permissions);
    const permissions: ResolvedPermission[] =
      permissionsFromJwt ??
      (await knexRbacRepository.findResolvedPermissionsByUser({
        userId,
        clinicId,
      }));

    request.user = {
      id: userId,
      clinicId,
      permissions,
    };

    return next();
  } catch (err: any) {
    return responseError(response, err);
  }
};
