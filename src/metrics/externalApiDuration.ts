import { register } from "./index";
import client from "prom-client";

const externalApiDuration = new client.Histogram({
  name: "external_api_duration_seconds",
  help: "Duração das chamadas para APIs externas",
  labelNames: ["service", "endpoint"],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
});

register.registerMetric(externalApiDuration);

export const observeExternalApiDuration = (
  service: string,
  endpoint: string,
  durationMs: number
) => {
  externalApiDuration.observe(
    { service, endpoint },
    durationMs / 1000
  );
};
