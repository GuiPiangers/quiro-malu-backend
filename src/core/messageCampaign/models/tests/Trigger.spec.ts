import { DateTime } from "../../../shared/Date";
import { Trigger, TriggerDTO } from "../Trigger";

const mockEvent = "createPatient";

describe("Trigger", () => {
  it("deve inicializar corretamente com os valores fornecidos", () => {
    const dto: TriggerDTO = { event: mockEvent, delayOperatorInMinutes: 30 };
    const trigger = new Trigger(dto);

    expect(trigger.event).toBe(mockEvent);
    expect(trigger.delayOperatorInMinutes).toBe(30);
  });

  it("deve definir delayOperatorInMinutes como 0 se não for fornecido", () => {
    const dto: TriggerDTO = { event: mockEvent };
    const trigger = new Trigger(dto);

    expect(trigger.delayOperatorInMinutes).toBe(0);
  });

  it("deve calcular corretamente o delay com um operador positivo", () => {
    const dto: TriggerDTO = { event: mockEvent, delayOperatorInMinutes: 10 };
    const trigger = new Trigger(dto);

    const now = DateTime.now();
    const delay = trigger.calculateDelay(now);

    expect(delay).toBeGreaterThan(0);
    expect(delay).toBeCloseTo(10 * 60 * 1000, -10); // Aproximadamente 10 minutos em ms
  });

  it("deve retornar 0 se o delay já tiver passado", () => {
    const dto: TriggerDTO = { event: mockEvent, delayOperatorInMinutes: -10 };
    const trigger = new Trigger(dto);

    const now = DateTime.now();
    const delay = trigger.calculateDelay(now);

    expect(delay).toBe(0);
  });
});
