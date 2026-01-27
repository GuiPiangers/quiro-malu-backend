import { register } from "./index";
import client from "prom-client";

const cacheHitCounter = new client.Counter({
  name: "cache_operations_total",
  help: "Total de operações de cache",
  labelNames: ["operation", "result", "cache_type"],
});

register.registerMetric(cacheHitCounter);

export const trackCacheOperation = (
  operation: "get" | "set" | "delete",
  result: "hit" | "miss" | "success" | "error",
  cacheType: string = "redis"
) => {
  cacheHitCounter.inc({ operation, result, cache_type: cacheType });
};
