export const MAX_FINGERPRINTS_PER_USER = 5;

export type UserFingerprintUpsertProps = {
  userId: string;
  fpHash: string;
};

export interface IUserFingerprintRepository {
  isKnown(props: UserFingerprintUpsertProps): Promise<boolean>;
  upsertTouchLastUsed(props: UserFingerprintUpsertProps): Promise<void>;
  registerNewFingerprint(props: UserFingerprintUpsertProps): Promise<void>;
}
