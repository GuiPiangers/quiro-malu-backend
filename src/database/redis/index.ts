import { Redis } from "ioredis";
const host = process.env.DB_REDIS_HOST;

const port = Number(process.env.DB_REDIS_PORT) || 6379;

const redis = new Redis({
  host,
  port,
  maxRetriesPerRequest: null,
});

export { redis };
