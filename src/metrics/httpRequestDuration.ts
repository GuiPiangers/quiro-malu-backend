import { Request, Response } from "express";
import client from "prom-client";
import responseTime from "response-time";
import { register } from "./index";
import { normalizeRoute } from "./utils/normalizeRoute";

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duração das requisições HTTP em segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 5],
});

register.registerMetric(httpRequestDuration);

const httpRequestDurationMiddleware = responseTime(
  (req: Request, res: Response, time) => {
    const route = normalizeRoute(req);

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode,
      },
      time / 1000
    );
  }
);

export { httpRequestDurationMiddleware };
