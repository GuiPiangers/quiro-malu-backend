import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
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
    return next();
  } catch (err: any) {
    const statusCode = err.statusCode ?? 401;
    return response.status(statusCode).json({
      message: err.message || "Unexpected error.",
    });
  }
};
