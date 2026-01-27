import { register } from "./index";
import client from "prom-client";

const externalApiCallCounter = new client.Counter({
  name: "external_api_calls_total",
  help: "Total de chamadas para APIs externas",
  labelNames: ["service", "endpoint", "status_code"],
});

register.registerMetric(externalApiCallCounter);

export const trackExternalApiCall = (
  service: string,
  endpoint: string,
  statusCode: number
) => {
  externalApiCallCounter.inc({ service, endpoint, status_code: statusCode });
};