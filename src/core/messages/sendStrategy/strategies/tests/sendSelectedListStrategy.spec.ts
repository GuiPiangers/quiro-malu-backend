import { SendSelectedListStrategy } from "../sendSelectedListStrategy";

describe("SendSelectedListStrategy", () => {
  it("deve permitir paciente presente na lista", async () => {
    const sut = new SendSelectedListStrategy(["p-1", "p-2"]);

    const ok = await sut.allowsSend({ userId: "u-1", patientId: "p-1" });

    expect(ok).toBe(true);
  });

  it("deve negar paciente ausente da lista", async () => {
    const sut = new SendSelectedListStrategy(["p-1"]);

    const ok = await sut.allowsSend({ userId: "u-1", patientId: "p-other" });

    expect(ok).toBe(false);
  });

  it("deve negar quando a lista estiver vazia", async () => {
    const sut = new SendSelectedListStrategy([]);

    const ok = await sut.allowsSend({ userId: "u-1", patientId: "p-1" });

    expect(ok).toBe(false);
  });
});
