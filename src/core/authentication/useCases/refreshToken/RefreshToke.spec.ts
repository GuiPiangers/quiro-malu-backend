import { RefreshToken } from "../../models/RefreshToken";
import { ApiError } from "../../../../utils/ApiError";
import dayjs from "dayjs";
import {
  createMockGenerateTokenProvider,
  createMockRefreshTokenProvider,
} from "../../../../repositories/_mocks/UserRepositoryMock";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

// Mock dependencies
const mockRefreshTokenProvider = createMockRefreshTokenProvider();

const mockGenerateTokenProvider = createMockGenerateTokenProvider();

describe("RefreshTokenUseCase", () => {
  let refreshTokenUseCase: RefreshTokenUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    refreshTokenUseCase = new RefreshTokenUseCase(
      mockRefreshTokenProvider,
      mockGenerateTokenProvider,
    );
  });

  describe("execute", () => {
    const mockUserId = "user-123";
    const mockToken = "new-access-token";

    it("should throw ApiError when refresh token is invalid", async () => {
      mockRefreshTokenProvider.getRefreshToken.mockResolvedValueOnce([]);

      await expect(refreshTokenUseCase.execute("invalid-id")).rejects.toThrow(
        new ApiError("Refresh Token inválido", 401),
      );
    });

    it("should return new access token when refresh token is valid and not expired", async () => {
      const validRefreshToken = new RefreshToken({
        id: "valid-id",
        userId: mockUserId,
        expiresIn: dayjs().add(1, "hour").unix(),
      });

      mockRefreshTokenProvider.getRefreshToken.mockResolvedValueOnce([
        validRefreshToken,
      ]);
      mockGenerateTokenProvider.execute.mockResolvedValueOnce(mockToken);

      const result = await refreshTokenUseCase.execute("valid-id");

      expect(result).toEqual({ token: mockToken });
      expect(mockRefreshTokenProvider.generate).not.toHaveBeenCalled();
    });

    // it("should generate new refresh token when current one is expired", async () => {
    //   const expiredRefreshToken = new RefreshToken({
    //     id: "expired-id",
    //     userId: mockUserId,
    //     expiresIn: dayjs().subtract(1, "hour").unix(),
    //   });

    //   mockRefreshTokenProvider.getRefreshToken.mockResolvedValue([
    //     expiredRefreshToken,
    //   ]);
    //   mockGenerateTokenProvider.execute.mockResolvedValue(mockToken);
    //   mockRefreshTokenProvider.generate.mockResolvedValue();

    //   const result = await refreshTokenUseCase.execute("expired-id");

    //   expect(result).toEqual({
    //     token: mockToken,
    //     newRefreshToken: expect.any(Object),
    //   });

    //   expect(mockRefreshTokenProvider.generate).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       userId: mockUserId,
    //       expiresIn: expiredRefreshToken.expiresIn,
    //     }),
    //   );
    // });

    it("should propagate errors from dependencies", async () => {
      const testError = new Error("Test error");
      mockRefreshTokenProvider.getRefreshToken.mockRejectedValueOnce(testError);

      await expect(refreshTokenUseCase.execute("any-id")).rejects.toThrow(
        testError,
      );
    });
  });
});
