import mysql from "mysql2";
import * as dotenv from "dotenv";
import { ApiError } from "../utils/ApiError";
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect((err) => {
  if (err)
    throw new ApiError(
      "falha ao realizar a conexão com o banco de dados" + err,
      500,
    );

  console.log("Conexão realizada com sucesso");
});

export function escapeSansQuotes(criterion: string) {
  const value = connection.escape(criterion).match(/^'(.+)'$/);
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

export const query = <T>(
  errorMessage: string,
  sql: string,
  data?: any,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    connection.query(sql, data, (err, result) => {
      if (err) reject(errorMessage);
      console.log(err);
      resolve(JSON.parse(JSON.stringify(result)));
    });
  });
};

export default connection;
