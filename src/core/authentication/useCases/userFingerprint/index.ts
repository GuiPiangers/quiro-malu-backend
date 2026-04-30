import { RegisterUserFingerprintUseCase } from "./RegisterUserFingerprintUseCase";
import { ValidateUserFingerprintUseCase } from "./ValidateUserFingerprintUseCase";
import { knexUserFingerprintRepository } from "../../../../repositories/userFingerprint/knexInstances";

const userFingerprintRepository = knexUserFingerprintRepository;

export const validateUserFingerprintUseCase = new ValidateUserFingerprintUseCase(
  userFingerprintRepository,
);

export const registerUserFingerprintUseCase = new RegisterUserFingerprintUseCase(
  userFingerprintRepository,
);

export { RegisterUserFingerprintUseCase } from "./RegisterUserFingerprintUseCase";
export { ValidateUserFingerprintUseCase } from "./ValidateUserFingerprintUseCase";