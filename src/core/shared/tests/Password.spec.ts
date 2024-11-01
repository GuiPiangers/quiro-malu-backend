import { Password } from "../Password";
import { ApiError } from "../../../utils/ApiError";
import { Crypto } from "../helpers/Crypto";

jest.mock("../helpers/Crypto");

describe("Password", () => {
  it("should throw an error if the password is shorter than 5 characters", () => {
    expect(() => new Password("Ab1")).toThrow(ApiError);
    expect(() => new Password("Ab1")).toThrow(
      "A senha deve conter pelo menos 5 caracteres",
    );
  });

  it("should throw an error if the password does not contain an uppercase letter", () => {
    expect(() => new Password("abcd1")).toThrow(ApiError);
    expect(() => new Password("abcd1")).toThrow(
      "A senha deve conter pelo menos uma letra maiúscula",
    );
  });

  it("should throw an error if the password does not contain a number or special character", () => {
    expect(() => new Password("Abcde")).toThrow(ApiError);
    expect(() => new Password("Abcde")).toThrow(
      "A senha deve conter pelo menos um número ou carácter especial",
    );
  });

  it("should create a Password instance for a valid password", () => {
    const password = new Password("Abcd1!");
    expect(password.value).toBe("Abcd1!");
  });

  it("should generate a hash for a valid password", async () => {
    const password = new Password("Abcd1!");
    const fakeHash = "hashedpassword123";
    (Crypto.createHash as jest.Mock).mockResolvedValue(fakeHash);

    const hash = await password.getHash();

    expect(Crypto.createHash).toHaveBeenCalledWith("Abcd1!");
    expect(hash).toBe(fakeHash);
  });
});
