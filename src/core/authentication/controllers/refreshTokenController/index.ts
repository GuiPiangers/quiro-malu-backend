import { refreshTokenProvider } from "../../../../repositories/token/RefreshTokenProvider";
import { generateTokenProvider } from "../../../../repositories/token/GenerateTokenProvider";
import { RefreshTokenController } from "./RefreshTokenController";
import { RefreshTokenUseCase } from "../../useCases/refreshToken/RefreshTokenUseCase";
import { RefreshTokenCache } from "../../../../repositories/token/RefreshTokenCache";

const refreshTokenCache = new RefreshTokenCache(refreshTokenProvider);

const refreshTokenUseCase = new RefreshTokenUseCase(
  refreshTokenCache,
  generateTokenProvider,
);
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

export { refreshTokenController };
