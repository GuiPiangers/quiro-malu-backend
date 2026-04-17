import { DateTime as Luxon } from "luxon";
import { computeDelayMsUntilSendTimeToday } from "../computeDelayMsUntilSendTimeToday";

describe("computeDelayMsUntilSendTimeToday", () => {
  it("deve retornar diferença positiva quando o horário ainda não passou hoje", () => {
    const ref = Luxon.fromObject(
      { year: 2026, month: 4, day: 17, hour: 7, minute: 0, second: 0 },
      { zone: "America/Sao_Paulo" },
    );
    const delay = computeDelayMsUntilSendTimeToday("10:30", ref);
    expect(delay).toBe(ref.set({ hour: 10, minute: 30, second: 0 }).diff(ref).as("milliseconds"));
  });

  it("deve retornar 0 quando o horário de envio já passou", () => {
    const ref = Luxon.fromObject(
      { year: 2026, month: 4, day: 17, hour: 18, minute: 0, second: 0 },
      { zone: "America/Sao_Paulo" },
    );
    expect(computeDelayMsUntilSendTimeToday("09:00", ref)).toBe(0);
  });
});
