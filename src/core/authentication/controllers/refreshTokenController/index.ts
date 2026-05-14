import { refreshTokenProvider } from "../../../../repositories/token/RefreshTokenProvider";
import { generateTokenProvider } from "../../../../repositories/token/GenerateTokenProvider";
import { RefreshTokenController } from "./RefreshTokenController";
import { RefreshTokenUseCase } from "../../useCases/refreshToken/RefreshTokenUseCase";
import { RefreshTokenCache } from "../../../../repositories/token/RefreshTokenCache";
import { knexUserRepository } from "../../../../repositories/user/knexInstances";

const refreshTokenCache = new RefreshTokenCache(refreshTokenProvider);

const refreshTokenUseCase = new RefreshTokenUseCase(
  refreshTokenCache,
  generateTokenProvider,
  knexUserRepository,
);
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

export { refreshTokenController };
