import { AppEventListener } from "../../../../../shared/observers/EventListener";
import { createMockBeforeScheduleMessageRepository } from "../../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import { CreateBeforeScheduleMessageUseCase } from "../CreateBeforeScheduleMessageUseCase";

describe("CreateBeforeScheduleMessageUseCase", () => {
  it("should create entity and persist message", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();

    const appEventListener = new AppEventListener();
    const emitSpy = jest.spyOn(appEventListener, "emit");

    const useCase = new CreateBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      appEventListener,
    );

    const result = await useCase.execute({
      userId: "user-1",
      name: "Lembrete padrão",
      minutesBeforeSchedule: 60,
      messageTemplate: {
        textTemplate: "Oi {{nome}}, seu horario esta proximo.",
      },
    });

    expect(beforeScheduleMessageRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Lembrete padrão",
        minutesBeforeSchedule: 60,
        textTemplate: "Oi {{nome}}, seu horario esta proximo.",
        isActive: true,
      }),
    );

    expect(emitSpy).toHaveBeenCalledWith("beforeScheduleMessageCreate", {
      id: result.id,
      userId: "user-1",
      name: "Lembrete padrão",
      minutesBeforeSchedule: 60,
      isActive: true,
    });

    expect(result).toEqual({
      id: result.id,
      name: "Lembrete padrão",
      minutesBeforeSchedule: 60,
      isActive: true,
      messageTemplate: {
        id: result.messageTemplate.id,
        textTemplate: "Oi {{nome}}, seu horario esta proximo.",
      },
    });
  });

  it("should persist isActive false when provided", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();

    const appEventListener = new AppEventListener();
    const emitSpy = jest.spyOn(appEventListener, "emit");

    const useCase = new CreateBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      appEventListener,
    );

    const result = await useCase.execute({
      userId: "user-2",
      name: "Desativada label",
      minutesBeforeSchedule: 15,
      isActive: false,
      messageTemplate: { textTemplate: "Desativada" },
    });

    expect(beforeScheduleMessageRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-2",
        name: "Desativada label",
        isActive: false,
      }),
    );

    expect(emitSpy).toHaveBeenCalledWith("beforeScheduleMessageCreate", {
      id: result.id,
      userId: "user-2",
      name: "Desativada label",
      minutesBeforeSchedule: 15,
      isActive: false,
    });

    expect(result.isActive).toBe(false);
  });
});
