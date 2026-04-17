import { AppEventListener } from "../../../../../shared/observers/EventListener";
import { createMockAfterScheduleMessageRepository } from "../../../../../../repositories/_mocks/AfterScheduleMessageRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { CreateAfterScheduleMessageUseCase } from "../CreateAfterScheduleMessageUseCase";

describe("CreateAfterScheduleMessageUseCase", () => {
  it("deve criar entidade, persistir e emitir afterScheduleMessageCreate", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();
    const appEventListener = new AppEventListener();
    const emitSpy = jest.spyOn(appEventListener, "emit");

    const useCase = new CreateAfterScheduleMessageUseCase(
      afterScheduleMessageRepository,
      appEventListener,
    );

    const result = await useCase.execute({
      userId: "user-1",
      name: "Agradecimento padrão",
      minutesAfterSchedule: 120,
      messageTemplate: {
        textTemplate: "Obrigado {{nome_paciente}} pela consulta.",
      },
    });

    expect(afterScheduleMessageRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Agradecimento padrão",
        minutesAfterSchedule: 120,
        textTemplate: "Obrigado {{nome_paciente}} pela consulta.",
        isActive: true,
      }),
    );

    expect(emitSpy).toHaveBeenCalledWith("afterScheduleMessageCreate", {
      id: result.id,
      userId: "user-1",
      name: "Agradecimento padrão",
      minutesAfterSchedule: 120,
      isActive: true,
    });

    expect(result).toEqual({
      id: result.id,
      name: "Agradecimento padrão",
      minutesAfterSchedule: 120,
      isActive: true,
      messageTemplate: {
        id: result.messageTemplate.id,
        textTemplate: "Obrigado {{nome_paciente}} pela consulta.",
      },
    });
  });

  it("deve persistir isActive false quando informado", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();
    const appEventListener = new AppEventListener();
    const emitSpy = jest.spyOn(appEventListener, "emit");

    const useCase = new CreateAfterScheduleMessageUseCase(
      afterScheduleMessageRepository,
      appEventListener,
    );

    const result = await useCase.execute({
      userId: "user-2",
      name: "Desativada",
      minutesAfterSchedule: 15,
      isActive: false,
      messageTemplate: { textTemplate: "Inativa" },
    });

    expect(afterScheduleMessageRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-2",
        name: "Desativada",
        isActive: false,
      }),
    );

    expect(emitSpy).toHaveBeenCalledWith("afterScheduleMessageCreate", {
      id: result.id,
      userId: "user-2",
      name: "Desativada",
      minutesAfterSchedule: 15,
      isActive: false,
    });

    expect(result.isActive).toBe(false);
  });

  it("deve lançar ApiError quando name estiver vazio", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();
    const appEventListener = new AppEventListener();

    const useCase = new CreateAfterScheduleMessageUseCase(
      afterScheduleMessageRepository,
      appEventListener,
    );

    await expect(
      useCase.execute({
        userId: "user-1",
        name: "   ",
        minutesAfterSchedule: 30,
        messageTemplate: { textTemplate: "x" },
      }),
    ).rejects.toThrow(ApiError);

    expect(afterScheduleMessageRepository.save).not.toHaveBeenCalled();
  });
});
