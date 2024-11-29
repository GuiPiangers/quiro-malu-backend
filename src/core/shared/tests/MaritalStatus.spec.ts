import { MaritalStatus } from "../MaritalStatus";

describe("gender", () => {
  it("Should throw an ApiError if gender is not masculino or feminino", () => {
    try {
      const maritalStatus = new MaritalStatus("invalid");
    } catch (error: any) {
      expect(error.message).toBe("O estádo cívil definido é inválido");
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe("maritalStatus");
    }
  });

  it("Should create new maritalStatus if value is valid", () => {
    const maritalStatus = new MaritalStatus("Casado");
    const maritalStatus2 = new MaritalStatus("Divorciado");
    const maritalStatus3 = new MaritalStatus("solteiro");
    const maritalStatus4 = new MaritalStatus("viúvo");

    expect(maritalStatus.value).toBe("casado");
    expect(maritalStatus2.value).toBe("divorciado");
    expect(maritalStatus3.value).toBe("solteiro");
    expect(maritalStatus4.value).toBe("viuvo");
  });

  it("Should convert maritalStatus to lowerCase", () => {
    const maritalStatus = new MaritalStatus("CASADO");

    expect(maritalStatus.value).toBe("casado");
  });

  it("Should remove accent from marital status", () => {
    const maritalStatus = new MaritalStatus("viúvo");

    expect(maritalStatus.value).toBe("viuvo");
  });
});
