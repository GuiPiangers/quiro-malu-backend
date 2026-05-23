import { RefreshToken } from '../../models/RefreshToken'
import { ApiError } from '../../../../utils/ApiError'
import dayjs from 'dayjs'
import {
  createMockGenerateTokenProvider,
  createMockRefreshTokenProvider,
  createMockUserRepository,
} from '../../../../repositories/_mocks/UserRepositoryMock'
import { createMockRbacRepository } from '../../../../repositories/_mocks/RbacRepositoryMock'
import { RefreshTokenUseCase } from './RefreshTokenUseCase'

const mockRefreshTokenProvider = createMockRefreshTokenProvider()

const mockGenerateTokenProvider = createMockGenerateTokenProvider()
const mockUserRepository = createMockUserRepository()
const mockRbacRepository = createMockRbacRepository()

const fingerprint = 'device-fingerprint'
const clinicId = '00000000-0000-4000-8000-000000000001'
const mockPermissions = [{ key: 'patients:read', scope: { type: 'all' as const } }]

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    mockRbacRepository.findResolvedPermissionsByUser.mockResolvedValue(
      mockPermissions,
    )
    refreshTokenUseCase = new RefreshTokenUseCase(
      mockRefreshTokenProvider,
      mockGenerateTokenProvider,
      mockUserRepository,
      mockRbacRepository,
    )
  })

  describe('execute', () => {
    const mockUserId = 'user-123'
    const mockToken = 'new-access-token'

    it('should throw ApiError when refresh token is invalid', async () => {
      mockRefreshTokenProvider.getRefreshToken.mockResolvedValueOnce(null)

      await expect(
        refreshTokenUseCase.execute('invalid-id', fingerprint),
      ).rejects.toThrow(new ApiError('Refresh Token inválido', 401))
    })

    it('should throw when fingerprint does not match', async () => {
      const validRefreshToken = new RefreshToken({
        id: '00000000-0000-4000-8000-000000000001',
        userId: mockUserId,
        clinicId,
        fingerprint: 'other-fp',
        expiresIn: dayjs().add(1, 'hour').unix(),
      })

      mockRefreshTokenProvider.getRefreshToken.mockResolvedValueOnce(
        validRefreshToken.getDTO(),
      )

      await expect(
        refreshTokenUseCase.execute(validRefreshToken.id, fingerprint),
      ).rejects.toThrow(
        new ApiError('Refresh Token inválido para este dispositivo', 401),
      )
    })

    it('should return new access and refresh tokens when refresh token is valid and not expired', async () => {
      const validRefreshToken = new RefreshToken({
        id: '00000000-0000-4000-8000-000000000001',
        userId: mockUserId,
        clinicId,
        fingerprint,
        expiresIn: dayjs().add(1, 'hour').unix(),
      })

      mockRefreshTokenProvider.getRefreshToken.mockResolvedValueOnce(
        validRefreshToken.getDTO(),
      )
      vi.mocked(mockUserRepository.getById).mockResolvedValueOnce([
        {
          id: mockUserId,
          name: 'User Test',
          email: 'user@test.com',
          phone: '(51) 99999 9999',
          password: 'hash',
          clinicId,
        },
      ])
      mockGenerateTokenProvider.execute.mockResolvedValueOnce(mockToken)

      const result = await refreshTokenUseCase.execute(
        validRefreshToken.id,
        fingerprint,
      )

      expect(result).toEqual({
        token: mockToken,
        refreshToken: expect.any(String),
      })
      expect(mockUserRepository.getById).toHaveBeenCalledWith({
        userId: mockUserId,
        clinicId,
      })
      expect(mockRefreshTokenProvider.markAsUsed).toHaveBeenCalledWith(
        validRefreshToken.id,
      )
      expect(mockRefreshTokenProvider.generate).toHaveBeenCalled()
      expect(mockRefreshTokenProvider.delete).toHaveBeenCalledWith(
        validRefreshToken.id,
      )
      expect(mockRbacRepository.findResolvedPermissionsByUser).toHaveBeenCalledWith({
        userId: mockUserId,
        clinicId,
      })
      expect(mockGenerateTokenProvider.execute).toHaveBeenCalledWith({
        userId: mockUserId,
        clinicId,
        permissions: mockPermissions,
      })
    })

    it('should throw when refresh token is expired', async () => {
      const expiredRefreshToken = new RefreshToken({
        id: '00000000-0000-4000-8000-000000000003',
        userId: mockUserId,
        clinicId,
        fingerprint,
        expiresIn: dayjs().subtract(1, 'hour').unix(),
      })

      mockRefreshTokenProvider.getRefreshToken.mockResolvedValueOnce(
        expiredRefreshToken.getDTO(),
      )

      await expect(
        refreshTokenUseCase.execute(expiredRefreshToken.id, fingerprint),
      ).rejects.toThrow(
        new ApiError('Sessão expirada, faça login novamente', 401),
      )
      expect(mockRefreshTokenProvider.deleteByFingerprint).toHaveBeenCalledWith(
        mockUserId,
        fingerprint,
      )
    })

    it('should propagate errors from dependencies', async () => {
      const testError = new Error('Test error')
      mockRefreshTokenProvider.getRefreshToken.mockRejectedValueOnce(testError)

      await expect(
        refreshTokenUseCase.execute('any-id', fingerprint),
      ).rejects.toThrow(testError)
    })
  })
})

export {}
