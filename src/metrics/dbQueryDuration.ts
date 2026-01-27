import { register } from "./index";
import client from "prom-client";

const dbQueryDuration = new client.Histogram({
  name: "db_query_duration_seconds",
  help: "Duração das queries em segundos",
  labelNames: ["database", "operation", "table"],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

register.registerMetric(dbQueryDuration);

export const observeDbQueryDuration = (
  database: string,
  operation: string,
  table: string,
  durationMs: number
) => {
  dbQueryDuration.observe(
    { database, operation, table },
    durationMs / 1000 // Converte para segundos
  );
};