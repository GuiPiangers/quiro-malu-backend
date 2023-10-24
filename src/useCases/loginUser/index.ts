import { refreshTokenProvider } from "../../provider/refreshToken/RefreshTokenProvider";
import { generateTokenProvider } from "../../provider/token/GenerateTokenProvider";
import { MySqlUserRepository } from "../../repositories/user/MySqlUserRepository";
import { LoginUserController } from "./LoginUserController";
import { LoginUserUseCase } from "./LoginUserUseCase";

const userRepository = new MySqlUserRepository()
const loginUserUseCase = new LoginUserUseCase(userRepository, refreshTokenProvider, generateTokenProvider)

const loginUserController = new LoginUserController(loginUserUseCase)

export { loginUserUseCase, loginUserController }