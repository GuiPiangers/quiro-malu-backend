import { AppEventListener } from "../../../../../shared/observers/EventListener";
import { createMockBirthdayMessageRepository } from "../../../../../../repositories/_mocks/BirthdayMessageRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { CreateBirthdayMessageUseCase } from "../CreateBirthdayMessageUseCase";

describe("CreateBirthdayMessageUseCase", () => {
  it("deve criar entidade, persistir e emitir birthdayMessageCreate", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();
    const appEventListener = new AppEventListener();
    const emitSpy = jest.spyOn(appEventListener, "emit");

    const useCase = new CreateBirthdayMessageUseCase(
      birthdayMessageRepository,
      appEventListener,
    );

    const result = await useCase.execute({
      userId: "user-1",
      name: "Parabéns padrão",
      messageTemplate: {
        textTemplate:
          "Olá {{nome_paciente}}, feliz {{dia_aniversario}}! Tel {{telefone_paciente}}",
      },
    });

    expect(birthdayMessageRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Parabéns padrão",
        textTemplate:
          "Olá {{nome_paciente}}, feliz {{dia_aniversario}}! Tel {{telefone_paciente}}",
        isActive: true,
        sendTime: "09:00:00",
      }),
    );

    expect(emitSpy).toHaveBeenCalledWith("birthdayMessageCreate", {
      id: result.id,
      userId: "user-1",
      name: "Parabéns padrão",
      isActive: true,
      sendTime: "09:00",
    });

    expect(result).toEqual({
      id: result.id,
      name: "Parabéns padrão",
      isActive: true,
      sendTime: "09:00",
      messageTemplate: {
        id: result.messageTemplate.id,
        textTemplate:
          "Olá {{nome_paciente}}, feliz {{dia_aniversario}}! Tel {{telefone_paciente}}",
      },
    });
  });

  it("deve persistir sendTime quando informado", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();
    const appEventListener = new AppEventListener();
    const emitSpy = jest.spyOn(appEventListener, "emit");

    const useCase = new CreateBirthdayMessageUseCase(
      birthdayMessageRepository,
      appEventListener,
    );

    const result = await useCase.execute({
      userId: "user-3",
      name: "Tarde",
      sendTime: "15:45",
      messageTemplate: { textTemplate: "Boa tarde" },
    });

    expect(birthdayMessageRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sendTime: "15:45:00",
      }),
    );

    expect(emitSpy).toHaveBeenCalledWith(
      "birthdayMessageCreate",
      expect.objectContaining({ sendTime: "15:45" }),
    );

    expect(result.sendTime).toBe("15:45");
  });

  it("deve persistir isActive false quando informado", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();
    const appEventListener = new AppEventListener();
    const emitSpy = jest.spyOn(appEventListener, "emit");

    const useCase = new CreateBirthdayMessageUseCase(
      birthdayMessageRepository,
      appEventListener,
    );

    const result = await useCase.execute({
      userId: "user-2",
      name: "Mensagem inativa",
      isActive: false,
      messageTemplate: { textTemplate: "Inativa" },
    });

    expect(birthdayMessageRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-2",
        name: "Mensagem inativa",
        isActive: false,
      }),
    );

    expect(emitSpy).toHaveBeenCalledWith("birthdayMessageCreate", {
      id: result.id,
      userId: "user-2",
      name: "Mensagem inativa",
      isActive: false,
      sendTime: "09:00",
    });

    expect(result.isActive).toBe(false);
  });

  it("deve propagar erro quando o repositório falhar ao salvar", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();
    birthdayMessageRepository.save.mockRejectedValue(
      new ApiError("Erro de banco", 500),
    );

    const appEventListener = new AppEventListener();
    const emitSpy = jest.spyOn(appEventListener, "emit");

    const useCase = new CreateBirthdayMessageUseCase(
      birthdayMessageRepository,
      appEventListener,
    );

    await expect(
      useCase.execute({
        userId: "user-1",
        name: "Válido",
        messageTemplate: { textTemplate: "x" },
      }),
    ).rejects.toMatchObject({ statusCode: 500, message: "Erro de banco" });

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
