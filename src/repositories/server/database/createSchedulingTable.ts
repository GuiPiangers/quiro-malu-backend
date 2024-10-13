import { query } from "../mySqlConnection"

export async function createSchedulingTable(){
    const sql = `CREATE TABLE IF NOT EXISTS scheduling(
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50),
        patientId VARCHAR(50),
        date DATETIME,
        duration FLOAT,
        service VARCHAR(50),
        status VARCHAR(15),
        createAt DATETIME DEFAULT NOW(),
        updateAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`
    const errorMessage = `Não foi possível criar a tabela`
    const result = await query(errorMessage, sql)
    return result
}