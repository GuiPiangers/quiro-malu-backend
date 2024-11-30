import { Normalize } from "../Normalize";

describe("normalize Class", () => {
  const removeAccent = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const alphabeticOnly = (value: string) => value.replace(/[^a-zA-Z]/g, "");

  describe("convertObject method", () => {
    it("should normalize data and match the expected keys", () => {
      const result = Normalize.convertObject(
        {
          phone: ["celular", "telefone"],
          dateOfBirth: ["datadenascimento"],
          cpf: ["cpf"],
          name: ["nome"],
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
      const result = Normalize.convertObject(
        {
          phone: ["celular", "telefone"],
          dateOfBirth: ["datadenascimento"],
        },
        {
          Nome: "Jane Doe", // Não mapeado em expect
        },
      );

      expect(result).toEqual({});
    });

    it("should handle arrays of potential keys in expect", () => {
      const result = Normalize.convertObject(
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
      const result = Normalize.convertObject(
        {
          email: ["email"],
          adress: ["endereco"],
        },
        {
          "É-mail": "test@example.com", // Entrada com acento
          endereço: "Rua Central", // Entrada com cedilha
        },
      );

      expect(result).toEqual({
        email: "test@example.com",
        adress: "Rua Central",
      });
    });

    it("should handle unexpected keys in data gracefully", () => {
      const result = Normalize.convertObject(
        {
          cpf: ["cpf"],
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
  });

  describe("normalizeString method", () => {
    it("should remove accents correctly", () => {
      const input = "áéíóúãõç";
      const output = Normalize.normalizeString(input);
      expect(output).toBe("aeiouaoc");
    });

    it("should remove non-alphabetic characters", () => {
      const input = "abc123-!@#def";
      const output = Normalize.normalizeString(input);
      expect(output).toBe("abcdef");
    });

    it('should replace cedilla for "c"', () => {
      const input = "çççç";
      const output = Normalize.normalizeString(input);
      expect(output).toBe("cccc");
    });

    it("should lowercase value", () => {
      const input = "INPUT";
      const output = Normalize.normalizeString(input);
      expect(output).toBe("input");
    });
  });
});
