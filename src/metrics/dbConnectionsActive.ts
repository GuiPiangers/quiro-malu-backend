import { register } from "./index";
import client from "prom-client";

const dbConnectionsActive = new client.Gauge({
  name: "db_connections_active",
  help: "Número de conexões ativas no pool",
  labelNames: ["database"],
});

register.registerMetric(dbConnectionsActive);

export const updateDbConnections = (database: string, count: number) => {
  dbConnectionsActive.set({ database }, count);
};