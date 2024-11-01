import { Name } from "../Name";
import { ApiError } from "../../../utils/ApiError";

describe("Name", () => {
  it("should throw an error if the name is empty", () => {
    expect(() => new Name("")).toThrow(ApiError);
    expect(() => new Name("")).toThrow("O nome é obrigatório");
  });

  it("should throw an error if the name length is less than the minimum allowed", () => {
    expect(() => new Name("Al", { min: 3 })).toThrow(ApiError);
    expect(() => new Name("Al", { min: 3 })).toThrow(
      "Deve ser informado no mínimo 3 caracteres",
    );
  });

  it("should throw an error if the name length exceeds the maximum allowed", () => {
    const longName = "A".repeat(121);
    expect(() => new Name(longName, { max: 120 })).toThrow(ApiError);
    expect(() => new Name(longName, { max: 120 })).toThrow(
      "Deve ser informado no máximo 120 caracteres",
    );
  });

  it("should throw an error if a compound name is required but not provided", () => {
    expect(() => new Name("John", { compoundName: true })).toThrow(ApiError);
    expect(() => new Name("John", { compoundName: true })).toThrow(
      "O valor deve ser um nome composto",
    );
  });

  it("should throw an error if the minimum length is greater than the maximum length", () => {
    expect(() => new Name("John", { min: 10, max: 5 })).toThrow(ApiError);
    expect(() => new Name("John", { min: 10, max: 5 })).toThrow(
      "valor mínimo não pode ser maior que o valor máximo",
    );
  });

  it("should create an instance with a valid single name when it meets the constraints", () => {
    const name = new Name("John");
    expect(name.value).toBe("John");
  });

  it("should create an instance with a valid compound name when it meets the constraints", () => {
    const name = new Name("John Doe", { compoundName: true });
    expect(name.value).toBe("John Doe");
  });

  it("should capitalize the name correctly", () => {
    const name = new Name("john doe");
    expect(name.value).toBe("John Doe");
  });

  it("should return only the first name from the full name", () => {
    const name = new Name("John Doe");
    expect(name.firstName).toBe("John");
  });
});
