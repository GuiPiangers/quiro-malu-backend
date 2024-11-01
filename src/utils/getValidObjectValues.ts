export function getValidObjectValues(object: { [key: string]: any }) {
  const result = {} as { [key: string]: any };

  for (const key in object) {
    const value = object[key];
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}
