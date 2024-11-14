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
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.query(sql, data);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error(error);

    if (error && (error as any).fatal) {
      console.log("Tentando reconectar...");
      connection = await pool.getConnection();
      const [result] = await connection.query(sql, data);
      return JSON.parse(JSON.stringify(result));
    }

    throw new ApiError(errorMessage, 500);
  } finally {
    if (connection) connection.release();
  }
};

export default pool;
