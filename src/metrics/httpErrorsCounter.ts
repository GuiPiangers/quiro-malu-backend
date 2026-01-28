import { NextFunction, Request, Response } from "express";
import { register } from "./index";
import client from "prom-client";
import { normalizeRoute } from "./utils/normalizeRoute";

const httpErrorsCounter = new client.Counter({
    name: "http_errors_total",
    help: "Total de erros HTTP",
    labelNames: ["method", "route", "status_code", "error_type"],
});

register.registerMetric(httpErrorsCounter);

export const httpErrorsCounterMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.on("finish", () => {
        if (res.statusCode >= 400) {
            const route = normalizeRoute(req);
            const errorType = res.statusCode >= 500 ? "server_error" : "client_error";

            httpErrorsCounter.inc({
                method: req.method,
                route,
                status_code: res.statusCode,
                error_type: errorType,
            });
        }
    });
    next();
};