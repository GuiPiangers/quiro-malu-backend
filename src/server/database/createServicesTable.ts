import { query } from "../mySqlConnection"

export async function createServicesTable() {
    const sql = `CREATE TABLE IF NOT EXISTS services(
        id VARCHAR(50) PRIMARY KEY, 
        name VARCHAR(50) UNIQUE NOT NULL, 
        value FLOAT, 
        duration FLOAT
        )`

    const errorMessage = `Não foi possível criar a tabela`
    const result = await query(errorMessage, sql)
    return result
}