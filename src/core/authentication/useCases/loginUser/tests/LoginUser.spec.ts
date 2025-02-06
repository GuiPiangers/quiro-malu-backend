import { User, UserDTO } from "../../../models/User";
import { IGenerateTokenProvider } from "../../../../../repositories/token/IGenerateTokenProvider";
import { IRefreshTokenProvider } from "../../../../../repositories/token/IRefreshTokenProvider";
import { InMemoryGenerateToken } from "../../../../../repositories/token/inMemory/InMemoryGenerateToken";
import { InMemoryRefreshToken } from "../../../../../repositories/token/inMemory/InMemoryRefreshToken";
import { IUserRepository } from "../../../../../repositories/user/IUserRepository";
import { InMemoryUserRepository } from "../../../../../repositories/user/inMemory/InMemoryUserRepository";
import { LoginUserUseCase } from "../LoginUserUseCase";

describe("Login user", () => {
  let userRepository: IUserRepository;
  let loginUserUseCase: LoginUserUseCase;
  let refreshToken: IRefreshTokenProvider;
  let generateToken: IGenerateTokenProvider;

  beforeAll(() => {
    userRepository = new InMemoryUserRepository();
    refreshToken = new InMemoryRefreshToken();
    generateToken = new InMemoryGenerateToken();
    loginUserUseCase = new LoginUserUseCase(
      userRepository,
      refreshToken,
      generateToken,
    );
  });

  it("Should be able to login", async () => {
    const email = "guilherme@gmail.com";
    const password = "Senha123";
    const userData: UserDTO = {
      email,
      password,
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
    };

    const user = new User(userData);
    const userDTO = await user.getUserDTO();

    await userRepository.save(userDTO);
    const resolve = await loginUserUseCase.execute(email, password);

    expect(resolve).toHaveProperty("token");
    expect(resolve).toHaveProperty("refreshToken");
  });

  it("Should not be able to login if email is not corrected", async () => {
    const email = "emailfake@gmail.com";
    const password = "Senha123";
    await expect(loginUserUseCase.execute(email, password)).rejects.toEqual(
      new Error("Email ou senha inválidos"),
    );
  });

  it("Should not be able to login if password is not corrected", async () => {
    const email = "emailFake2@gmail.com";
    const wrongPassword = "Senha1234";
    const userData: UserDTO = {
      email,
      password: "Senha123",
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
    };

    const user = new User(userData);
    const userDTO = await user.getUserDTO();

    await userRepository.save(userDTO);
    await expect(
      loginUserUseCase.execute(email, wrongPassword),
    ).rejects.toEqual(new Error("Email ou senha inválidos"));
  });
});

export {};
