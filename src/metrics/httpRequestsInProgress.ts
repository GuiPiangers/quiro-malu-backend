import { NextFunction, Request, Response } from "express";
import { register } from "./index";
import client from "prom-client";
import { normalizeRoute } from "./utils/normalizeRoute";

const httpRequestsInProgress = new client.Gauge({
  name: "http_requests_in_progress",
  help: "Número de requisições HTTP em andamento",
  labelNames: ["method", "route"],
});

register.registerMetric(httpRequestsInProgress);

const httpRequestsInProgressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const route = normalizeRoute(req);
  const labels = { method: req.method, route };

  httpRequestsInProgress.inc(labels);

  res.on("finish", () => {
    httpRequestsInProgress.dec(labels);
  });

  next();
};

export { httpRequestsInProgressMiddleware };