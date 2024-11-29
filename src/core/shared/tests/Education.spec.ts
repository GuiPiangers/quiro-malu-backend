import { Education, EducationType } from "../Education";
import { ApiError } from "../../../utils/ApiError";
import { Normalize } from "../Normalize";

describe("Education Class", () => {
  it("should create a valid instance with a valid education type", () => {
    const validEducation: EducationType = "superior completo";
    const education = new Education(validEducation);
    expect(education.value).toBe(validEducation);
  });

  it("should create a valid instance with partially valid input (converted)", () => {
    const education = new Education("superior");
    expect(education.value).toBe("superior completo");
  });

  it("should normalize the input by removing accents and unnecessary spaces", () => {
    const education = new Education("ensino médio incompleto");
    expect(education.value).toBe("medio incompleto");
  });

  it("should throw an error if the input is invalid", () => {
    expect(() => new Education("invalid")).toThrowError(ApiError);
    expect(() => new Education("invalid")).toThrowError(
      "A escolaridade definida é inválida",
    );
  });

  it("should return undefined if no education type is provided", () => {
    const education = new Education();
    expect(education.value).toBeUndefined();
  });

  it("should append 'completo' to the input when necessary", () => {
    const education = new Education("medio");
    expect(education.value).toBe("medio completo");
  });

  it("should work with uppercase strings", () => {
    const education = new Education("SUPERIOR COMPLETO");
    expect(education.value).toBe("superior completo");
  });

  it("should not throw an error if the input is undefined", () => {
    expect(() => new Education(undefined)).not.toThrow();
  });
});
