import { refreshTokenProvider } from "../../../../repositories/token/RefreshTokenProvider";
import { generateTokenProvider } from "../../../../repositories/token/GenerateTokenProvider";
import { registerUserFingerprintUseCase } from "../../useCases/userFingerprint";
import { LoginUserController } from "./LoginUserController";
import { LoginUserUseCase } from "../../useCases/loginUser/LoginUserUseCase";
import { knexUserRepository } from "../../../../repositories/user/knexInstances";

const userRepository = knexUserRepository;
const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  refreshTokenProvider,
  generateTokenProvider,
  registerUserFingerprintUseCase,
);

const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserController };