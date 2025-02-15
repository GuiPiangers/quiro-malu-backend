import { app } from "./app";
import "dotenv/config";
import { start } from "./start";

const PORT = process.env.PORT ?? 8000;

app.listen(PORT, () => {
  start();
  console.log(`Servidor rodando no endereço: http://localhost:${PORT}`);
});
