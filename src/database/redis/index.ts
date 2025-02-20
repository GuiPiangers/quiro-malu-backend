import { Redis } from "ioredis";
const host = process.env.DB_REDIS_HOST;

const redis = new Redis({
  host,
  maxRetriesPerRequest: null,
});

export { redis };
