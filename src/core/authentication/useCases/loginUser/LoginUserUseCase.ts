import dayjs from "dayjs";
import { RefreshToken } from "../../models/RefreshToken";
import { IRefreshTokenProvider } from "../../../../repositories/token/IRefreshTokenProvider";
import { IGenerateTokenProvider } from "../../../../repositories/token/IGenerateTokenProvider";
import { IUserRepository } from "../../../../repositories/user/IUserRepository";
import { Crypto } from "../../../shared/helpers/Crypto";
import { ApiError } from "../../../../utils/ApiError";
import type { RegisterUserFingerprintUseCase } from "../userFingerprint/RegisterUserFingerprintUseCase";

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenProvider: IRefreshTokenProvider,
    private generateTokenProvider: IGenerateTokenProvider,
    private registerUserFingerprintUseCase: RegisterUserFingerprintUseCase,
  ) {}

  async execute(email: string, password: string, fingerprintHash: string) {
    const [user] = await this.userRepository.getByEmail(email);
    if (!user || !user.id) throw new ApiError("Email ou senha inválidos", 400);

    const passwordMatch = await Crypto.compareRandomHash(
      password,
      user.password,
    );
    if (!passwordMatch) throw new ApiError("Email ou senha inválidos", 400);

    await this.registerUserFingerprintUseCase.execute({
      userId: user.id,
      fpHash: fingerprintHash,
    });

    const token = await this.generateTokenProvider.execute(user.id);
    const expiresIn = dayjs().add(15, "days").unix();
    const refreshToken = new RefreshToken({ userId: user.id, expiresIn });

    await this.refreshTokenProvider.generate({
      expiresIn: refreshToken.expiresIn,
      userId: refreshToken.userId,
      id: refreshToken.id,
    });

    return {
      token,
      refreshToken: refreshToken.id,
      user: {
        email: user.email,
        name: user.name,
      },
    };
  }
}
