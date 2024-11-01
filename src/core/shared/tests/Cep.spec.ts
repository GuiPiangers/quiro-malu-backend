import { ApiError } from "../../../utils/ApiError";
import { Cep } from "../Cep";

describe("Cep", () => {
  it("should create an instance of Cep when the value is in the correct format", () => {
    const validCep = "12345-678";
    const cep = new Cep(validCep);

    expect(cep.value).toBe(validCep);
  });

  it("should throw an ApiError when the Cep is diferent then expected format", () => {
    const invalidCep = "12345678";

    expect(() => new Cep(invalidCep)).toThrow(ApiError);
    expect(() => new Cep(invalidCep)).toThrow("CEP fora do padrão esperado");
  });

  it("should throw an ApiError with status code 400", () => {
    const invalidCep = "abcde-fgh";

    try {
      const cep = new Cep(invalidCep);
    } catch (error: any) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe("CEP fora do padrão esperado");
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe("cep");
    }
  });
});
