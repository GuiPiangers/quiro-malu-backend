import { app } from "./app";
import "dotenv/config";

const PORT = process.env.PORT ?? 8000;

app.listen(PORT, () => {
  console.log(`Servidor rodando no endereço: http://localhost:${PORT}`);
});
