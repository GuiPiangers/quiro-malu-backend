import type { IUserFingerprintRepository } from "../../../../../repositories/userFingerprint/IUserFingerprintRepository";
import { ValidateUserFingerprintUseCase } from "../ValidateUserFingerprintUseCase";

describe("ValidateUserFingerprintUseCase", () => {
  it("deve retornar true e atualizar lastUsed quando o fingerprint já é conhecido", async () => {
    const repo: jest.Mocked<IUserFingerprintRepository> = {
      isKnown: jest.fn().mockResolvedValue(true),
      upsertTouchLastUsed: jest.fn().mockResolvedValue(undefined),
      registerNewFingerprint: jest.fn(),
    };
    const sut = new ValidateUserFingerprintUseCase(repo);
    const dto = { userId: "user-1", fpHash: "abc" };

    await expect(sut.execute(dto)).resolves.toBe(true);

    expect(repo.isKnown).toHaveBeenCalledWith(dto);
    expect(repo.upsertTouchLastUsed).toHaveBeenCalledWith(dto);
    expect(repo.registerNewFingerprint).not.toHaveBeenCalled();
  });

  it("deve retornar false quando o fingerprint é desconhecido", async () => {
    const repo: jest.Mocked<IUserFingerprintRepository> = {
      isKnown: jest.fn().mockResolvedValue(false),
      upsertTouchLastUsed: jest.fn(),
      registerNewFingerprint: jest.fn(),
    };
    const sut = new ValidateUserFingerprintUseCase(repo);

    await expect(
      sut.execute({ userId: "user-1", fpHash: "unknown" }),
    ).resolves.toBe(false);

    expect(repo.upsertTouchLastUsed).not.toHaveBeenCalled();
  });
});
