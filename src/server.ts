import "dotenv/config";
import { app } from "./app";
import { logger } from "./utils/logger";
import { start } from "./start";

const PORT = process.env.PORT ?? 8000;

app.listen(PORT, () => {
  start().catch((err) => logger.error({ err }, "startup failed"));
  logger.info({ port: PORT }, "server listening");
});
