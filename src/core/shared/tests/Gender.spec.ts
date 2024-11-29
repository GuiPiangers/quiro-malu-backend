import { Gender } from "../Gender";

describe("gender", () => {
  it("Should throw an ApiError if gender is not masculino or feminino", () => {
    try {
      const gender = new Gender("invalid");
    } catch (error: any) {
      expect(error.message).toBe("O gênero definido é inválido");
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe("gender");
    }
  });

  it("Should create new gender if value is valid", () => {
    const gender = new Gender("masculino");
    const gender2 = new Gender("feminino");

    expect(gender.value).toBe("masculino");
    expect(gender2.value).toBe("feminino");
  });

  it("Should convert gender to lowerCase", () => {
    const gender = new Gender("MASCULINO");
    const gender2 = new Gender("FEMININO");

    expect(gender.value).toBe("masculino");
    expect(gender2.value).toBe("feminino");
  });
});
