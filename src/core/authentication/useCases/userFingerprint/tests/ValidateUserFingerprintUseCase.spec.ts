import type { IUserFingerprintRepository } from "../../../../../repositories/userFingerprint/IUserFingerprintRepository";
import { ValidateUserFingerprintUseCase } from "../ValidateUserFingerprintUseCase";
import type { Mocked } from "vitest";

describe("ValidateUserFingerprintUseCase", () => {
  it("deve retornar true e atualizar lastUsed quando o fingerprint já é conhecido", async () => {
    const repo: Mocked<IUserFingerprintRepository> = {
      isKnown: vi.fn().mockResolvedValue(true),
      upsertTouchLastUsed: vi.fn().mockResolvedValue(undefined),
      registerNewFingerprint: vi.fn(),
    };
    const sut = new ValidateUserFingerprintUseCase(repo);
    const dto = { userId: "user-1", fpHash: "abc" };

    await expect(sut.execute(dto)).resolves.toBe(true);

    expect(repo.isKnown).toHaveBeenCalledWith(dto);
    expect(repo.upsertTouchLastUsed).toHaveBeenCalledWith(dto);
    expect(repo.registerNewFingerprint).not.toHaveBeenCalled();
  });

  it("deve retornar false quando o fingerprint é desconhecido", async () => {
    const repo: Mocked<IUserFingerprintRepository> = {
      isKnown: vi.fn().mockResolvedValue(false),
      upsertTouchLastUsed: vi.fn(),
      registerNewFingerprint: vi.fn(),
    };
    const sut = new ValidateUserFingerprintUseCase(repo);

    await expect(
      sut.execute({ userId: "user-1", fpHash: "unknown" }),
    ).resolves.toBe(false);

    expect(repo.upsertTouchLastUsed).not.toHaveBeenCalled();
  });
});
