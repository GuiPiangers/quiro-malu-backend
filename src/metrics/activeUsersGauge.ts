import { register } from "./index";
import client from "prom-client";

const activeUsersGauge = new client.Gauge({
  name: "active_users",
  help: "Número de usuários ativos",
  labelNames: ["time_window"],
});

register.registerMetric(activeUsersGauge);

export const updateActiveUsers = (
  timeWindow: "1h" | "24h" | "7d",
  count: number
) => {
  activeUsersGauge.set({ time_window: timeWindow }, count);
};