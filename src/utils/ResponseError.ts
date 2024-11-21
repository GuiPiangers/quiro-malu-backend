import { Response } from "express";

export const responseError = (response: Response, err: any) => {
  console.log(err);
  const statusCode = err.statusCode ?? 500;
  return response.status(statusCode).json({
    message: err.message || "Unexpected error.",
    statusCode,
    type: err.type,
    error: true,
  });
};
