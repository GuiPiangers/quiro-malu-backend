import { patientFirstNameFromFullName } from "../patientFirstNameFromFullName";

describe("patientFirstNameFromFullName", () => {
  it("retorna o primeiro token separado por espaços", () => {
    expect(patientFirstNameFromFullName("Maria Silva Souza")).toBe("Maria");
  });

  it("ignora espaços nas pontas", () => {
    expect(patientFirstNameFromFullName("  João  ")).toBe("João");
  });

  it("retorna string vazia para nome vazio", () => {
    expect(patientFirstNameFromFullName("")).toBe("");
    expect(patientFirstNameFromFullName("   ")).toBe("");
  });
});
