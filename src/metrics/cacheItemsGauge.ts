import { register } from "./index";
import client from "prom-client";

const cacheItemsGauge = new client.Gauge({
  name: "cache_items_count",
  help: "Número de itens no cache",
  labelNames: ["cache_type"],
});

register.registerMetric(cacheItemsGauge);

export const updateCacheSize = (cacheType: string, count: number) => {
  cacheItemsGauge.set({ cache_type: cacheType }, count);
};