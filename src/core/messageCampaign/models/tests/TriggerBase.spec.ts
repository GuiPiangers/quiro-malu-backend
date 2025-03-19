import { DateTime } from "../../../shared/Date";
import { TriggerBase, TriggerDTO } from "../Trigger";

const mockEvent = "createPatient";

describe("TriggerBase", () => {
  it("deve inicializar corretamente com os valores fornecidos", () => {
    const dto: TriggerDTO = { event: mockEvent };
    const trigger = new TriggerBase(dto);

    expect(trigger.event).toBe(mockEvent);
  });

  it("deve definir delayOperatorInMinutes como 0 se não for fornecido", () => {
    const dto: TriggerDTO = { event: mockEvent };
    const trigger = new TriggerBase(dto);

    expect(trigger.calculateDelay({ date: DateTime.now() })).toBe(0);
  });

  it("deve calcular corretamente o delay com um operador positivo", () => {
    const dto: TriggerDTO = { event: mockEvent };
    const trigger = new TriggerBase(dto);

    const now = DateTime.now();
    const delay = trigger.calculateDelay({ date: now, delayInMinutes: 10 });

    expect(delay).toBeGreaterThan(0);
    expect(delay).toBeCloseTo(10 * 60 * 1000, -10); // Aproximadamente 10 minutos em ms
  });

  it("deve retornar 0 se o delay já tiver passado", () => {
    const dto: TriggerDTO = { event: mockEvent };
    const trigger = new TriggerBase(dto);

    const now = DateTime.now();
    const delay = trigger.calculateDelay({ date: now });

    expect(delay).toBe(0);
  });

  describe("getDTO", () => {
    it("Deve retornar o triggerDTO correto", () => {
      const triggerDTO: TriggerDTO = {
        event: mockEvent,
      };

      const trigger = new TriggerBase(triggerDTO);

      expect(trigger.getDTO()).toEqual({
        event: mockEvent,
        config: {},
      });
    });
  });
});
