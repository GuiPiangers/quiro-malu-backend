import { KnexUserFingerprintRepository } from "../../../../repositories/userFingerprint/KnexUserFingerprintRepository";
import { RegisterUserFingerprintUseCase } from "./RegisterUserFingerprintUseCase";
import { ValidateUserFingerprintUseCase } from "./ValidateUserFingerprintUseCase";

const userFingerprintRepository = new KnexUserFingerprintRepository();

export const validateUserFingerprintUseCase = new ValidateUserFingerprintUseCase(
  userFingerprintRepository,
);

export const registerUserFingerprintUseCase = new RegisterUserFingerprintUseCase(
  userFingerprintRepository,
);

export { RegisterUserFingerprintUseCase } from "./RegisterUserFingerprintUseCase";
export { ValidateUserFingerprintUseCase } from "./ValidateUserFingerprintUseCase";
