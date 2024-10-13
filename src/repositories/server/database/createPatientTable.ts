import { query } from "../mySqlConnection"
export async function createPatientTable(){
    const sql = `CREATE TABLE IF NOT EXISTS patients(
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50),
        phone VARCHAR(16),
        dateOfBirth DATE,
        gender VARCHAR(10),
        cpf VARCHAR(14),
        userId VARCHAR(50),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`
    const errorMessage = `Não foi possível criar a tabela`
    const result = await query(errorMessage, sql)
    return result
}
