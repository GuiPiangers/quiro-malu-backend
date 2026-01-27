import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({ 
  register,
  prefix: 'nodejs_',
});

export { register };