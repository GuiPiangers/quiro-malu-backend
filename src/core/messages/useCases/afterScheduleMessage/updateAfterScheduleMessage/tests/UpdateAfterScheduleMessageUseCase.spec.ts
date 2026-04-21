import { createMockAfterScheduleMessageRepository } from "../../../../../../repositories/_mocks/AfterScheduleMessageRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { UpdateAfterScheduleMessageUseCase } from "../UpdateAfterScheduleMessageUseCase";

const makeAppEventListener = () => ({ emit: jest.fn(), on: jest.fn() } as any);

const existingConfig = {
  id: "msg-1",
  userId: "user-1",
  name: "Agradecimento tarde",
  minutesAfterSchedule: 60,
  textTemplate: "Olá {{nome_paciente}}",
  isActive: true,
};

describe("UpdateAfterScheduleMessageUseCase", () => {
  const makeUseCase = () => {
    const repository = createMockAfterScheduleMessageRepository();
    const appEventListener = makeAppEventListener();
    const sut = new UpdateAfterScheduleMessageUseCase(repository, appEventListener);
    return { sut, repository, appEventListener };
  };

  it("deve lançar ApiError 404 quando a mensagem não for encontrada", async () => {
    const { sut, repository } = makeUseCase();
    repository.getById.mockResolvedValue(null);

    await expect(
      sut.execute({ id: "msg-1", userId: "user-1" }),
    ).rejects.toThrow(ApiError);

    expect(repository.update).not.toHaveBeenCalled();
  });

  it("deve atualizar apenas os campos fornecidos e manter os demais", async () => {
    const { sut, repository } = makeUseCase();
    repository.getById.mockResolvedValue(existingConfig);
    repository.update.mockResolvedValue(undefined);

    const result = await sut.execute({
      id: "msg-1",
      userId: "user-1",
      minutesAfterSchedule: 30,
    });

    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "msg-1",
        userId: "user-1",
        minutesAfterSchedule: 30,
      }),
    );
    expect(result.minutesAfterSchedule).toBe(30);
    expect(result.isActive).toBe(true);
    expect(result.messageTemplate.textTemplate).toBe("Olá {{nome_paciente}}");
  });

  it("deve atualizar apenas o textTemplate mantendo os demais campos", async () => {
    const { sut, repository } = makeUseCase();
    repository.getById.mockResolvedValue(existingConfig);
    repository.update.mockResolvedValue(undefined);

    const result = await sut.execute({
      id: "msg-1",
      userId: "user-1",
      messageTemplate: { textTemplate: "Nova mensagem {{nome_paciente}}" },
    });

    expect(result.messageTemplate.textTemplate).toBe("Nova mensagem {{nome_paciente}}");
    expect(result.minutesAfterSchedule).toBe(60);
    expect(result.isActive).toBe(true);
  });

  it("deve emitir afterScheduleMessageUpdate com os dados atualizados", async () => {
    const { sut, repository, appEventListener } = makeUseCase();
    repository.getById.mockResolvedValue(existingConfig);
    repository.update.mockResolvedValue(undefined);

    await sut.execute({ id: "msg-1", userId: "user-1", isActive: false });

    expect(appEventListener.emit).toHaveBeenCalledWith(
      "afterScheduleMessageUpdate",
      expect.objectContaining({
        id: "msg-1",
        userId: "user-1",
        name: "Agradecimento tarde",
        isActive: false,
      }),
    );
  });

  it("deve lançar ApiError quando minutesAfterSchedule for inválido", async () => {
    const { sut, repository } = makeUseCase();
    repository.getById.mockResolvedValue(existingConfig);

    await expect(
      sut.execute({ id: "msg-1", userId: "user-1", minutesAfterSchedule: 0 }),
    ).rejects.toThrow(ApiError);

    expect(repository.update).not.toHaveBeenCalled();
  });
});
