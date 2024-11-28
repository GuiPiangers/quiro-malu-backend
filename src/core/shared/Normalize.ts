export abstract class Normalize {
  static convertObject<T extends object>(
    expect: { [key in keyof T]: string[] },
    data: { [key: string]: any },
  ) {
    const normalizedData: { [key: string]: any } = {};
    for (const key in data) {
      const normalizedKey = Normalize.normilizeString(key);
      normalizedData[normalizedKey] = data[key];
    }

    const expectEntries = Object.entries(expect);
    const normalizedExpect = expectEntries.reduce(
      (acc, [key, value]) => {
        if (Array.isArray(value)) {
          const normalizedDataKeys = Object.keys(normalizedData);

          const dataKey = value.find((valueKey) => {
            return normalizedDataKeys.some((nKey) => nKey === valueKey);
          });

          if (dataKey) return { ...acc, [key]: normalizedData[dataKey] };
        }

        return acc;
      },
      {} as { [key: string]: any },
    );

    return normalizedExpect as T;
  }

  static normilizeString(value: string) {
    return alphabeticOnly(
      removeCedilla(removeAccent(value)),
    ).toLocaleLowerCase();
  }
}

function removeAccent(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function alphabeticOnly(value: string) {
  return value.replace(/[^a-zA-Z]/g, "");
}
function removeCedilla(value: string) {
  return value.replace(/[ç]/g, "c");
}
