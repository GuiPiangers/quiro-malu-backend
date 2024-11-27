import { PatientDTO } from "../patients/models/Patient";

export function normalize<T extends object>(
  expect: { [key in keyof T]: string | string[] },
  data: { [key: string]: any },
) {
  const normilizedData: { [key: string]: any } = {};
  for (const key in data) {
    const normilizedKey = alphabeticOnly(removeAccent(key)).toLocaleLowerCase();
    normilizedData[normilizedKey] = data[key];
  }

  const expectEntries = Object.entries(expect);
  const normilizedExpect = expectEntries.reduce(
    (acc, [key, value]) => {
      if (typeof value === "string")
        return { ...acc, [key]: normilizedData[value] };

      if (Array.isArray(value)) {
        const normilizedDataKeys = Object.keys(normilizedData);

        const dataKey = value.find((valueKey) => {
          return normilizedDataKeys.some((nKey) => nKey === valueKey);
        });

        if (dataKey) return { ...acc, [key]: normilizedData[dataKey] };
      }

      return acc;
    },
    {} as { [key: string]: any },
  );

  return normilizedExpect as T;
}

function removeAccent(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function alphabeticOnly(value: string) {
  return value.replace(/[^a-zA-Z]/g, "");
}

const objectNormilized = normalize<PatientDTO>(
  {
    phone: ["celular", "telefone"],
    dateOfBirth: "datadenascimento",
    cpf: "cpf",
    name: "nome",
  },
  {
    CELULAR: "(51) 98035 1927",
    "Data de nascimento": "2000-10-21",
    cpf: "(51) 98035 1927",
  },
);

console.log(objectNormilized);
