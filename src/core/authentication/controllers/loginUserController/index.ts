import { refreshTokenProvider } from "../../../../repositories/token/RefreshTokenProvider";
import { generateTokenProvider } from "../../../../repositories/token/GenerateTokenProvider";
import { MySqlUserRepository } from "../../../../repositories/user/MySqlUserRepository";
import { LoginUserController } from "./LoginUserController";
import { LoginUserUseCase } from "../../useCases/loginUser/LoginUserUseCase";

const userRepository = new MySqlUserRepository()
const loginUserUseCase = new LoginUserUseCase(userRepository, refreshTokenProvider, generateTokenProvider)

const loginUserController = new LoginUserController(loginUserUseCase)

export { loginUserController }