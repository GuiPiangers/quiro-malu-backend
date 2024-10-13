import { query } from "../mySqlConnection"
export async function createAnamnesisTable(){
    const sql = `CREATE TABLE IF NOT EXISTS anamnesis(
        patientId VARCHAR(50),
        userId VARCHAR(50),
        mainProblem TEXT,
        currentIllness TEXT,
        history TEXT,
        familiarHistory TEXT,
        activities TEXT,
        smoke VARCHAR(8),
        useMedicine BOOLEAN,
        medicines TEXT,
        underwentSurgery BOOLEAN,
        surgeries TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`
    const errorMessage = `Não foi possível criar a tabela`
    const result = await query(errorMessage, sql)
    return result
}
