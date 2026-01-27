import { NextFunction, Request, Response } from "express";
import { register } from "./index";
import client from "prom-client";
import { normalizeRoute } from "./utils/normalizeRoute";

const httpResponseSize = new client.Summary({
  name: "http_response_size_bytes",
  help: "Tamanho das respostas HTTP em bytes",
  labelNames: ["method", "route", "status_code"],
  percentiles: [0.5, 0.9, 0.95, 0.99],
});

register.registerMetric(httpResponseSize);

const httpResponseSizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    const contentLength = res.get("Content-Length");
    if (contentLength) {
      const route = normalizeRoute(req);

      httpResponseSize.observe(
        {
          method: req.method,
          route,
          status_code: res.statusCode,
        },
        parseInt(contentLength, 10)
      );
    }
  });
  next();
};

export { httpResponseSizeMiddleware };