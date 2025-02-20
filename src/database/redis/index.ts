import IORedis from "ioredis";
const host = process.env.DB_REDIS_HOST;

const redis = new IORedis({
  host,
  maxRetriesPerRequest: null,
});

export { redis };
