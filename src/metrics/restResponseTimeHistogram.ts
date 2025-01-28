import { Request, Response } from "express";
import client from "prom-client";
import responseTime from "response-time";
import { register } from "./index";

const restResponseTimeHistogram = new client.Histogram({
  name: "rest_response_time_duration_seconds",
  help: "REST API response time in seconds",
  labelNames: ["method", "route", "status_code"],
});
register.registerMetric(restResponseTimeHistogram);

const responseTimeMiddleware = responseTime(
  (req: Request, res: Response, time) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time / 1000,
      );
    }
  },
);

export { responseTimeMiddleware };
