import { register } from "./index";
import client from "prom-client";

const authEventsCounter = new client.Counter({
  name: "auth_events_total",
  help: "Total de eventos de autenticação",
  labelNames: ["event_type", "status"],
});

register.registerMetric(authEventsCounter);

export const trackAuthEvent = (
  eventType: "login" | "logout" | "register" | "password_reset" | "token_refresh",
  status: "success" | "failure"
) => {
  authEventsCounter.inc({ event_type: eventType, status });
};