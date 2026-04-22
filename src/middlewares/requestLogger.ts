import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { logger } from "../utils/logger";

type LogEvent = Record<string, unknown>;

const isObservedRoute = (path: string) => {
  const ignoredRoutes = ["/health", "/metrics"];
  return !ignoredRoutes.some(route => path.includes(route));
};

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {  
  const startTime = Date.now();
  const requestId = req.get("x-request-id") ?? randomUUID();

  const event: LogEvent = {
    requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  };

  (req as any).logEvent = event;
  res.locals.logEvent = event;
  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    const userId = (req)?.user?.id;
    if (userId) event.userId = userId;

    event.statusCode = res.statusCode;
    event.durationMs = Date.now() - startTime;

    const level =
      res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

      if(!isObservedRoute(event.path as string)) {
        return;
      }

    logger[level]({ ...event }, "request completed");
  });

  next();
};
