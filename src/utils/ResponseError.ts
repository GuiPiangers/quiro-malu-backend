import { Response } from "express";
import { logger } from "./logger";

type LogEvent = Record<string, unknown>;

type ErrorPayload = {
  type?: string;
  message?: string;
  statusCode?: number;
  stack?: string;
};

export const responseError = (
  response: Response,
  err: any,
  logEvent?: LogEvent,
) => {
  const statusCode = err?.statusCode ?? 500;

  const event: LogEvent | undefined =
    logEvent ?? (response.locals?.logEvent as LogEvent | undefined);

  if (event) {
    const errorPayload: ErrorPayload = {
      type: err?.type ?? err?.name,
      message: err?.message,
      statusCode,
    };

    if (statusCode >= 500 && err?.stack) {
      errorPayload.stack = err.stack;
    }

    event.error = errorPayload;
  }

  if (statusCode >= 500) {
    logger.error({ err, ...(event ?? {}) }, "unexpected error");
  }

  return response.status(statusCode).json({
    message: err?.message || "Unexpected error.",
    statusCode,
    type: err?.type,
    error: true,
  });
};
