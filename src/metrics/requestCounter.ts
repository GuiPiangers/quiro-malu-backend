import { NextFunction, Request, Response } from "express";
import { register } from "./";
import client from "prom-client";
import { normalizeRoute } from "./utils/normalizeRoute";

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total de requisições HTTP recebidas",
  labelNames: ["method", "route", "status_code"],
});

register.registerMetric(httpRequestCounter);

const httpRequestCounterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    const route = normalizeRoute(req);

    httpRequestCounter.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
  });
  next();
};

export { httpRequestCounterMiddleware };