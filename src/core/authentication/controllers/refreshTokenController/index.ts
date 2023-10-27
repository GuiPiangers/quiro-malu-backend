import { refreshTokenProvider } from "../../../../repositories/token/RefreshTokenProvider";
import { generateTokenProvider } from "../../../../repositories/token/GenerateTokenProvider";
import { RefreshTokenController } from "./RefreshTokenController";
import { RefreshTokenUseCase } from "../../useCases/refreshToken/RefreshTokenUseCase";

const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenProvider, generateTokenProvider)
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase)

export { refreshTokenController }