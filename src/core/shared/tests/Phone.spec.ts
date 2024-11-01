import { Phone } from "../Phone";
import { ApiError } from "../../../utils/ApiError";

describe("Phone", () => {
  it("should create a Phone instance for a valid phone number", () => {
    const phone = new Phone("(12) 34567 8901");
    expect(phone.value).toBe("(12) 34567 8901");
  });

  it("should throw an error if the phone number is missing the area code", () => {
    expect(() => new Phone("34567 8901")).toThrow(ApiError);
    expect(() => new Phone("34567 8901")).toThrow(
      "Número de telefone fora do padrão esperado",
    );
  });

  it("should throw an error if the phone number has incorrect digit count", () => {
    expect(() => new Phone("(12) 3456 8901")).toThrow(ApiError); // Too few digits in the middle segment
    expect(() => new Phone("(12) 345678 8901")).toThrow(ApiError); // Too many digits in the middle segment
  });

  it("should throw an error if the phone number is missing spaces or parentheses", () => {
    expect(() => new Phone("12 34567 8901")).toThrow(ApiError); // Missing parentheses
    expect(() => new Phone("(12)345678901")).toThrow(ApiError); // Missing spaces
  });

  it("should throw an error if the phone number is an empty string", () => {
    expect(() => new Phone("")).toThrow(ApiError);
    expect(() => new Phone("")).toThrow(
      "Número de telefone fora do padrão esperado",
    );
  });
});
