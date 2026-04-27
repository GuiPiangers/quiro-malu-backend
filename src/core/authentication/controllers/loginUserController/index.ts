import { refreshTokenProvider } from "../../../../repositories/token/RefreshTokenProvider";
import { generateTokenProvider } from "../../../../repositories/token/GenerateTokenProvider";
import { KnexUserRepository } from "../../../../repositories/user/KnexUserRepository";
import { registerUserFingerprintUseCase } from "../../useCases/userFingerprint";
import { LoginUserController } from "./LoginUserController";
import { LoginUserUseCase } from "../../useCases/loginUser/LoginUserUseCase";

const userRepository = new KnexUserRepository();
const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  refreshTokenProvider,
  generateTokenProvider,
  registerUserFingerprintUseCase,
);

const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserController };