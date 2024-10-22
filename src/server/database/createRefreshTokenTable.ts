import { query } from "../mySqlConnection";
export async function createRefreshTokenTable() {
  const sql = `CREATE TABLE IF NOT EXISTS refresh_token(
        userId VARCHAR(50),
        expiresIn INT,
        createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`;
  const errorMessage = `Não foi possível criar a tabela`;
  const result = await query(errorMessage, sql);
  return result;
}
