import "express-async-errors";
import express from "express";
import { router } from "./router";
import cors from "cors";
import { responseTimeMiddleware } from "./metrics/restResponseTimeHistogram";
import { register } from "./metrics";
import { httpRequestCounterMiddleware } from "./metrics/requestCounter";

const app = express();

app.use(express.json());

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

app.use(responseTimeMiddleware);
app.use(httpRequestCounterMiddleware);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use(router);

export { app };
