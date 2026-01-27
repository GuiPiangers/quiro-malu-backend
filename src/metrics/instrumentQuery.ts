import { trackDbQuery } from "./dbQueryCounter";
import { observeDbQueryDuration } from "./dbQueryDuration";

export const instrumentQuery = async <T>(
  database: string,
  operation: string,
  table: string,
  queryFn: () => Promise<T>
): Promise<T> => {
  const start = Date.now();
  let status: "success" | "error" = "success";

  try {
    const result = await queryFn();
    return result;
  } catch (error) {
    status = "error";
    throw error;
  } finally {
    const duration = Date.now() - start;
    trackDbQuery(database, operation, table, status);
    observeDbQueryDuration(database, operation, table, duration);
  }
};