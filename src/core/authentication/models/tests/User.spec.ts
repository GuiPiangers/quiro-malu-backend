import { User, UserDTO } from "../User";

describe("User (integration)", () => {
  test("should create User with valid values", async () => {
    const userData: UserDTO = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(51) 98765 4321",
      password: "plainPassword!",
    };

    const user = new User(userData);

    expect(user.name.value).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.phone).toBe("(51) 98765 4321");

    const passwordHash = await user.password.getHash();
    expect(passwordHash).not.toBe("plainPassword!");
    expect(passwordHash).toMatch(/^\$2[aby]\$.{56}$/); // Verificação básica de hash bcrypt
  });

  test("should return correct UserDTO from getUserDTO", async () => {
    const userData: UserDTO = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "(51) 98765 4321",
      password: "securePassword!",
    };

    const user = new User(userData);
    const userDTO = await user.getUserDTO();

    expect(userDTO).toEqual({
      id: user.id,
      email: "jane.doe@example.com",
      password: expect.any(String),
      name: "Jane Doe",
      phone: "(51) 98765 4321",
    });

    expect(userDTO.password).not.toBe("securePassword!");
    expect(userDTO.password).toMatch(/^\$2[aby]\$.{56}$/); // Confirma o formato de um hash bcrypt
  });

  test("should throw error with invalid email", () => {
    const userData: UserDTO = {
      name: "Invalid User",
      email: "invalid-email",
      phone: "(51) 98765 4321",
      password: "password",
    };

    expect(() => new User(userData)).toThrow("email inválido");
  });

  test("should throw error with invalid phone number", () => {
    const userData: UserDTO = {
      name: "Invalid User",
      email: "user@example.com",
      phone: "invalid-phone",
      password: "password",
    };

    expect(() => new User(userData)).toThrow(
      "Número de telefone fora do padrão esperado",
    );
  });
});
