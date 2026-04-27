import type {
  IUserFingerprintRepository,
  UserFingerprintUpsertProps,
} from "../../../../repositories/userFingerprint/IUserFingerprintRepository";

export class ValidateUserFingerprintUseCase {
  constructor(
    private readonly userFingerprintRepository: IUserFingerprintRepository,
  ) {}

  async execute(dto: UserFingerprintUpsertProps): Promise<boolean> {
    const known = await this.userFingerprintRepository.isKnown(dto);
    if (known) {
      await this.userFingerprintRepository.upsertTouchLastUsed(dto);
      return true;
    }
    return false;
  }
}
