import { query } from "../mySqlConnection"
export async function createUserTable(){
    const sql = `CREATE TABLE IF NOT EXISTS users(
        id VARCHAR(50) PRIMARY KEY, 
        name VARCHAR(50), 
        email VARCHAR(50), 
        phone VARCHAR(18), 
        password VARCHAR(50))`

    const errorMessage = `Não foi possível criar a tabela`

    const result = await query(errorMessage, sql)

    const sqlDatabases = `SHOW 
    TABLES`

    const resultTables = await query(errorMessage, sqlDatabases)
    console.log(resultTables)

    return result
}