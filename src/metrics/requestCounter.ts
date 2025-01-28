import { NextFunction, Request, Response } from "express";
import { register } from "./";
import client from "prom-client";

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total de requisições HTTP recebidas",
  labelNames: ["method", "route"],
});

register.registerMetric(httpRequestCounter);

const httpRequestCounterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.on("finish", () => {
    let route = req.route?.path || req.path;

    route = route.replace(/\/\d+/g, "/:id");
    route = route.replace(/\/[a-fA-F0-9-]{36}/g, "/:id");

    httpRequestCounter.inc({
      method: req.method,
      route,
    });
  });
  next();
};

export { httpRequestCounterMiddleware };
