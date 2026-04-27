import "express-async-errors";
import express from "express";
import { requestLoggerMiddleware } from "./middlewares/requestLogger";
import { router } from "./router";
import cors from "cors";
import { httpRequestDurationMiddleware } from "./metrics/httpRequestDuration";
import { register } from "./metrics";
import { httpRequestCounterMiddleware } from "./metrics/requestCounter";
import { mongoConnect } from "./database/mongoose";
import { httpRequestsInProgressMiddleware } from "./metrics/httpRequestsInProgress";
import { httpResponseSizeMiddleware } from "./metrics/httpResponseSize";
import { httpErrorsCounterMiddleware } from "./metrics/httpErrorsCounter";

const app = express();

app.use(express.json());

app.use(requestLoggerMiddleware);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PATCH,PUT,DELETE",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization",
  );

  app.use(cors());
  next();
});

app.use(httpRequestsInProgressMiddleware);
app.use(httpRequestDurationMiddleware);
app.use(httpRequestCounterMiddleware);
app.use(httpErrorsCounterMiddleware);
app.use(httpResponseSizeMiddleware);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get('/debug/ip', (req, res) => {
  res.json({
    'req.ip': req.ip,
    'req.socket.remoteAddress': req.socket?.remoteAddress,
    'cf-connecting-ip': req.headers['cf-connecting-ip'],
    'x-forwarded-for': req.headers['x-forwarded-for'],
    'x-real-ip': req.headers['x-real-ip'],
  });
});

app.use(router);

mongoConnect();

export { app };
