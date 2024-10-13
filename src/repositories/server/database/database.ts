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
export async function createPatientTable(){

    const sql = `CREATE TABLE IF NOT EXISTS patients(
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50),
        phone VARCHAR(16),
        dateOfBirth DATE,
        gender VARCHAR(10),
        cpf VARCHAR(14),
        userId VARCHAR(50),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )`
    const errorMessage = `Não foi possível criar a tabela`
    const result = await query(errorMessage, sql)
    return result
}
export async function createLocationTable(){
    const sql = `CREATE TABLE IF NOT EXISTS locations(
        id VARCHAR(50) PRIMARY KEY, 
        patientId VARCHAR(50),
        userId VARCHAR(50),
        cep VARCHAR(30),
        state VARCHAR(30),
        city VARCHAR(30),
        neighborhood VARCHAR(30),
        address VARCHAR(30),
        FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )`
    const errorMessage = `Não foi possível criar a tabela`
    const result = await query(errorMessage, sql)
    return result
}