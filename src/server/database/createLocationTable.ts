import { query } from "../mySqlConnection";
export async function createLocationTable() {
  const sql = `CREATE TABLE IF NOT EXISTS locations(
        id VARCHAR(50) PRIMARY KEY, 
        patientId VARCHAR(50),
        userId VARCHAR(50),
        cep VARCHAR(30),
        state VARCHAR(30),
        city VARCHAR(30),
        neighborhood VARCHAR(30),
        address VARCHAR(30),
        FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`;
  const errorMessage = `Não foi possível criar a tabela`;
  const result = await query(errorMessage, sql);
  return result;
}
