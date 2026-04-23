import { ExcludePatientsListStrategy } from "../excludePatientsListStrategy";

describe("ExcludePatientsListStrategy", () => {
  it("deve negar paciente presente na lista de exclusão", async () => {
    const sut = new ExcludePatientsListStrategy(["p-1", "p-2"]);

    const ok = await sut.allowsSend({ userId: "u-1", patientId: "p-1" });

    expect(ok).toBe(false);
  });

  it("deve permitir paciente fora da lista de exclusão", async () => {
    const sut = new ExcludePatientsListStrategy(["p-1"]);

    const ok = await sut.allowsSend({ userId: "u-1", patientId: "p-other" });

    expect(ok).toBe(true);
  });

  it("deve permitir qualquer paciente quando a lista estiver vazia", async () => {
    const sut = new ExcludePatientsListStrategy([]);

    const ok = await sut.allowsSend({ userId: "u-1", patientId: "p-1" });

    expect(ok).toBe(true);
  });
});
