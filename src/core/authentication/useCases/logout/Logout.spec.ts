import { createMockRefreshTokenProvider } from "../../../../repositories/_mocks/UserRepositoryMock";
import { LogoutUseCase } from "./logoutUseCase";

describe("Logout", () => {
  const mockRefreshTokenProvider = createMockRefreshTokenProvider();
  let logoutUseCase: LogoutUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    logoutUseCase = new LogoutUseCase(mockRefreshTokenProvider);
  });

  it("Should call delete method of refreshTokenProvider with correct params", async () => {
    const refreshTokenId = "test-refresh-token-id";

    await logoutUseCase.execute(refreshTokenId);
    expect(mockRefreshTokenProvider.delete).toHaveBeenCalledWith(
      refreshTokenId,
    );
    expect(mockRefreshTokenProvider.delete).toHaveBeenCalledTimes(1);
  });

  it("Should throw an Error if repository delete method throws ", async () => {
    const refreshTokenId = "test-refresh-token-id";
    const errorMessage = "Error deleting Finance";

    mockRefreshTokenProvider.delete.mockRejectedValue(new Error(errorMessage));

    await expect(logoutUseCase.execute(refreshTokenId)).rejects.toThrow(
      errorMessage,
    );
  });
});
