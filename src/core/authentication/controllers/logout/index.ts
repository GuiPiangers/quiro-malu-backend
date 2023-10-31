import { refreshTokenProvider } from "../../../../repositories/token/RefreshTokenProvider";
import { LogoutController } from "./LogoutController";
import { LogoutUseCase } from "../../useCases/logout/logoutUseCase";

const logoutUseCase = new LogoutUseCase(refreshTokenProvider)
const logoutController = new LogoutController(logoutUseCase)

export { logoutController }