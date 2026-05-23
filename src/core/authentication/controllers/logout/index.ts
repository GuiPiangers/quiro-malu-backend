import { refreshTokenProvider } from '../../../../repositories/token/RefreshTokenProvider'
import { RefreshTokenCache } from '../../../../repositories/token/RefreshTokenCache'
import { LogoutController } from './LogoutController'
import { LogoutUseCase } from '../../useCases/logout/logoutUseCase'

const logoutRefreshTokenCache = new RefreshTokenCache(refreshTokenProvider)
const logoutUseCase = new LogoutUseCase(logoutRefreshTokenCache)
const logoutController = new LogoutController(logoutUseCase)

export { logoutController }
