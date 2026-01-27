import { trackExternalApiCall } from "./externalApiCallCounter";
import { observeExternalApiDuration } from "./externalApiDuration";

export const instrumentExternalApi = async <T>(
  service: string,
  endpoint: string,
  apiFn: () => Promise<T>
): Promise<T> => {
  const start = Date.now();
  let statusCode = 200;

  try {
    const result = await apiFn();
    return result;
  } catch (error: any) {
    statusCode = error.response?.status || 500;
    throw error;
  } finally {
    const duration = Date.now() - start;
    trackExternalApiCall(service, endpoint, statusCode);
    observeExternalApiDuration(service, endpoint, duration);
  }
};