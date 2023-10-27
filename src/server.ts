import { app } from "./app";
import * as dotenv from 'dotenv'
dotenv.config()

console.log('chegou aqui')

const PORT = process.env.PORT ?? 8000

app.listen(PORT, () => {
    console.log(`Servidor rodando no endereço: http://localhost:${PORT}`)
})


