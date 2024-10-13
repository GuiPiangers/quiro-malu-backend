import { query } from "../mySqlConnection"
export async function createDiagnosticTable(){
    const sql = `CREATE TABLE IF NOT EXISTS anamnesis(
        patientId VARCHAR(50),
        userId VARCHAR(50),
        diagnostic TEXT,
        treatmentPlan TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`
    const errorMessage = `Não foi possível criar a tabela`
    const result = await query(errorMessage, sql)
    return result
}
