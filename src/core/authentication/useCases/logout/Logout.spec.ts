import { createMockRefreshTokenProvider } from '../../../../repositories/_mocks/UserRepositoryMock'
import { LogoutUseCase } from './logoutUseCase'

const mockRefreshTokenProvider = createMockRefreshTokenProvider()

describe('LogoutUseCase', () => {
  let logoutUseCase: LogoutUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    logoutUseCase = new LogoutUseCase(mockRefreshTokenProvider)
  })

  it('Should delete refresh token when session exists and fingerprint matches', async () => {
    const refreshTokenId = '00000000-0000-4000-8000-000000000001'
    const fingerprint = 'device-fp'
    mockRefreshTokenProvider.getRefreshToken.mockResolvedValueOnce({
      id: refreshTokenId,
      userId: 'user-1',
      fingerprint,
      expiresIn: 9999999999,
    })

    await logoutUseCase.execute(refreshTokenId, fingerprint)

    expect(mockRefreshTokenProvider.delete).toHaveBeenCalledWith(refreshTokenId)
    expect(mockRefreshTokenProvider.delete).toHaveBeenCalledTimes(1)
  })

  it('Should propagate errors from dependencies', async () => {
    const refreshTokenId = '00000000-0000-4000-8000-000000000002'
    const errorMessage = 'Database error'
    mockRefreshTokenProvider.getRefreshToken.mockResolvedValueOnce({
      id: refreshTokenId,
      userId: 'user-1',
      fingerprint: 'a',
      expiresIn: 9999999999,
    })
    mockRefreshTokenProvider.delete.mockRejectedValueOnce(
      new Error(errorMessage),
    )

    await expect(logoutUseCase.execute(refreshTokenId, 'a')).rejects.toThrow(
      errorMessage,
    )
  })
})

export {}
