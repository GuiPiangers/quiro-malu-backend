import { normalize } from "../Normalize";

describe("normalize function", () => {
  // Funções auxiliares para facilitar os testes
  const removeAccent = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const alphabeticOnly = (value: string) => value.replace(/[^a-zA-Z]/g, "");

  it("should normalize data and match the expected keys", () => {
    const result = normalize(
      {
        phone: ["celular", "telefone"],
        dateOfBirth: "datadenascimento",
        cpf: "cpf",
        name: "nome",
      },
      {
        CELULAR: "(51) 98035 1927",
        "Data de nascimento": "2000-10-21",
        cpf: "123.456.789-00",
        Nome: "John Doe",
      },
    );

    expect(result).toEqual({
      phone: "(51) 98035 1927",
      dateOfBirth: "2000-10-21",
      cpf: "123.456.789-00",
      name: "John Doe",
    });
  });

  it("should handle missing expected keys gracefully", () => {
    const result = normalize(
      {
        phone: ["celular", "telefone"],
        dateOfBirth: "datadenascimento",
      },
      {
        Nome: "Jane Doe", // Não mapeado em expect
      },
    );

    expect(result).toEqual({});
  });

  it("should handle arrays of potential keys in expect", () => {
    const result = normalize(
      {
        phone: ["celular", "telefone", "contato"],
      },
      {
        Telefone: "123456789",
      },
    );

    expect(result).toEqual({
      phone: "123456789",
    });
  });

  it("should handle normalization of accented and special characters", () => {
    const result = normalize(
      {
        email: "email",
      },
      {
        "É-mail": "test@example.com", // Entrada com acento
      },
    );

    expect(result).toEqual({
      email: "test@example.com",
    });
  });

  it("should handle unexpected keys in data gracefully", () => {
    const result = normalize(
      {
        cpf: "cpf",
      },
      {
        RANDOM: "value",
        cpf: "123.456.789-00",
      },
    );

    expect(result).toEqual({
      cpf: "123.456.789-00",
    });
  });

  describe("removeAccent function", () => {
    it("should remove accents correctly", () => {
      const input = "áéíóúãõç";
      const output = removeAccent(input);
      expect(output).toBe("aeiouaoc");
    });
  });

  describe("alphabeticOnly function", () => {
    it("should remove non-alphabetic characters", () => {
      const input = "abc123-!@#def";
      const output = alphabeticOnly(input);
      expect(output).toBe("abcdef");
    });
  });
});
