import { query } from "../mySqlConnection";
export async function createProgressTable() {
  const sql = `CREATE TABLE IF NOT EXISTS progress(
        patientId VARCHAR(50),
        userId VARCHAR(50),
        service VARCHAR(50),
        actualProblem TEXT,
        procedures TEXT,
        date DATE,
        createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`;
  const errorMessage = `Não foi possível criar a tabela`;
  const result = await query(errorMessage, sql);
  return result;
}
