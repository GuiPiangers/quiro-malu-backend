import "express-async-errors";
import express from "express";
import { router } from "./router";
import cors from "cors";
import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

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

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use(router);

export { app };
