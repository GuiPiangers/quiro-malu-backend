import { ApiError } from "../../../utils/ApiError";
import { Cpf } from "../Cpf";

describe("Cpf", () => {
  it("should create an instance of Cpf when the value is in the correct format", () => {
    const validCpf = "123.456.789-00";
    const cpf = new Cpf(validCpf);

    expect(cpf.value).toBe(validCpf);
  });

  it("should throw an ApiError when the Cpf is diferent then expected format", () => {
    const invalidCpf = "12345678900";

    expect(() => new Cpf(invalidCpf)).toThrow(ApiError);
    expect(() => new Cpf(invalidCpf)).toThrow("CPF fora do padrão esperado");
  });

  it("should throw an ApiError with status code 400", () => {
    const invalidCpf = "abc.def.ghi-jk";

    try {
      const cpf = new Cpf(invalidCpf);
    } catch (error: any) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe("CPF fora do padrão esperado");
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe("cpf");
    }
  });
});
