import { refreshTokenProvider } from "../../provider/refreshToken/RefreshTokenProvider";
import { generateTokenProvider } from "../../provider/token/GenerateTokenProvider";
import { RefreshTokenController } from "./RefreshTokenController";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenProvider, generateTokenProvider)
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase)

export { refreshTokenUseCase, refreshTokenController }