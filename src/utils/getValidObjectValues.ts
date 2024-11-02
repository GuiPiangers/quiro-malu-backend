export function getValidObjectValues<T>(object: T) {
  const result = {} as T;

  for (const key in object) {
    const value = object[key];
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}
