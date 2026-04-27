import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateRequestFingerprint } from "../core/authentication/utils/generateRequestFingerprint";
import { validateUserFingerprintUseCase } from "../core/authentication/useCases/userFingerprint";
import { ApiError } from "../utils/ApiError";
import { responseError } from "../utils/ResponseError";
import * as dotenv from "dotenv";
dotenv.config();

type JwtPayload = {
  id: string;
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
    request.user = verifyToken as unknown as JwtPayload;

    const userId = (request.user as JwtPayload).id;
    if (!userId) {
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

    return next();
  } catch (err: any) {
    return responseError(response, err);
  }
};
