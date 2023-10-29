import mysql from 'mysql2'
import * as dotenv from 'dotenv'
import { ApiError } from '../../utils/ApiError';
dotenv.config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) throw new ApiError("falha ao realizar a conexão com o banco de dados" + err, 500)

    console.log('Conexão realizada com sucesso')
})

export const query = <T>(
    errorMessage: string,
    sql: string,
    data?: any): Promise<T> => {

    return new Promise((resolve, reject) => {
        connection.query(sql, data, (err, result) => {
            if (err) reject(errorMessage)

            resolve(JSON.parse(JSON.stringify(result)))
        })
    })
}

export default connection