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

  describe("convertPhone", () => {
    it("should convert correct a 10 numbers phone to 11 numbers adding a 9", () => {
      const convertedPhone = Phone.convertPhone("5100001111");

      expect(convertedPhone).toBe("(51) 90000 1111");
    });

    it("should remove any not number character and format to expected pattern", () => {
      const convertedPhone = Phone.convertPhone("_51_ 90000-1111");

      expect(convertedPhone).toBe("(51) 90000 1111");
    });

    it("should remove any not format a number that the numbers of numeric characters are different of 10 or 11", () => {
      const convertedPhone = Phone.convertPhone("519000011111");
      const convertedPhone2 = Phone.convertPhone("510001111");

      expect(convertedPhone).toBe("519000011111");
      expect(convertedPhone2).toBe("510001111");
    });
  });
});
