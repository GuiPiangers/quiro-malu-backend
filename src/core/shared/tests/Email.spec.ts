import { Email } from "../Email";
import { ApiError } from "../../../utils/ApiError";

describe("Email", () => {
  it("should create an istance of Email when e-mail is valid", () => {
    const validEmail = "test@example.com";
    const email = new Email(validEmail);

    expect(email.value).toBe(validEmail);
  });

  it('shold thrown an ApiError when the e-mail not contain "@"', () => {
    const invalidEmailWithoutAt = "testexample.com";

    expect(() => new Email(invalidEmailWithoutAt)).toThrow(ApiError);
    expect(() => new Email(invalidEmailWithoutAt)).toThrow("email inválido");
    try {
      const email = new Email(invalidEmailWithoutAt);
    } catch (error: any) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe("email inválido");
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe("email");
    }
  });

  it('shold throw an ApiError when the email not contain "." on domain', () => {
    const invalidEmailWithoutDotInDomain = "test@examplecom";

    expect(() => new Email(invalidEmailWithoutDotInDomain)).toThrow(ApiError);
    expect(() => new Email(invalidEmailWithoutDotInDomain)).toThrow(
      "email inválido",
    );
    try {
      const email = new Email(invalidEmailWithoutDotInDomain);
    } catch (error: any) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe("email inválido");
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe("email");
    }
  });
});
