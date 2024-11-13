import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import { ApiError } from "../utils/ApiError";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// pool.connect((err) => {
//   if (err)
//     throw new ApiError(
//       "falha ao realizar a conexão com o banco de dados" + err,
//       500,
//     );

//   console.log("Conexão realizada com sucesso");
// });

export function escapeSansQuotes(criterion: string) {
  const value = pool.escape(criterion).match(/^'(.+)'$/);
  if (value) return value[1];
}

export function order({
  field,
  orientation,
}: {
  field: string;
  orientation: string;
}) {
  return (escapeSansQuotes(`${field} ${orientation}`) || "").replace(
    /[\\]/g,
    "",
  );
}

export const query = async <T>(
  errorMessage: string,
  sql: string,
  data?: any,
): Promise<T> => {
  try {
    const [result] = await pool.query(sql, data);
    console.log(result);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.log(error);
    throw new ApiError(errorMessage, 500);
  }
  // return new Promise((resolve, reject) => {
  //   pool.query(sql, data, (err, result) => {
  //     console.log(err);
  //     if (err) reject(errorMessage);
  //     resolve(JSON.parse(JSON.stringify(result)));
  //   });
  // });
};

export default pool;
