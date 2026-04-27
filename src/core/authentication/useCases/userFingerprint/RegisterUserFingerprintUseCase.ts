import type {
  IUserFingerprintRepository,
  UserFingerprintUpsertProps,
} from "../../../../repositories/userFingerprint/IUserFingerprintRepository";

export class RegisterUserFingerprintUseCase {
  constructor(
    private readonly userFingerprintRepository: IUserFingerprintRepository,
  ) {}

  async execute(dto: UserFingerprintUpsertProps): Promise<void> {
    await this.userFingerprintRepository.registerNewFingerprint(dto);
  }
}
