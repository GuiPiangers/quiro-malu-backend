import { register } from "./index";
import client from "prom-client";

const dbQueryCounter = new client.Counter({
  name: "db_queries_total",
  help: "Total de queries executadas no banco de dados",
  labelNames: ["database", "operation", "table", "status"],
});

register.registerMetric(dbQueryCounter);

export const trackDbQuery = (
  database: string,
  operation: string,
  table: string,
  status: "success" | "error"
) => {
  dbQueryCounter.inc({ database, operation, table, status });
};