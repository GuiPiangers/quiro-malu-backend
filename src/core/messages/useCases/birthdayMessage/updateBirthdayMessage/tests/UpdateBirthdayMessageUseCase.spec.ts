import { createMockBirthdayMessageRepository } from "../../../../../../repositories/_mocks/BirthdayMessageRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { UpdateBirthdayMessageUseCase } from "../UpdateBirthdayMessageUseCase";

const makeAppEventListener = () => ({ emit: jest.fn(), on: jest.fn() } as any);

const existingConfig = {
  id: "camp-1",
  userId: "user-1",
  name: "Aniversário",
  textTemplate: "Olá {{nome_paciente}}",
  isActive: true,
  sendTime: "09:00",
};

describe("UpdateBirthdayMessageUseCase", () => {
  const makeUseCase = () => {
    const repository = createMockBirthdayMessageRepository();
    const appEventListener = makeAppEventListener();
    const sut = new UpdateBirthdayMessageUseCase(repository, appEventListener);
    return { sut, repository, appEventListener };
  };

  it("deve lançar ApiError 404 quando a campanha não existir", async () => {
    const { sut, repository } = makeUseCase();
    repository.getById.mockResolvedValue(null);

    await expect(
      sut.execute({ id: "camp-1", userId: "user-1" }),
    ).rejects.toThrow(ApiError);

    expect(repository.update).not.toHaveBeenCalled();
  });

  it("deve atualizar apenas sendTime e persistir em formato TIME", async () => {
    const { sut, repository } = makeUseCase();
    repository.getById.mockResolvedValue(existingConfig);
    repository.update.mockResolvedValue(undefined);

    const result = await sut.execute({
      id: "camp-1",
      userId: "user-1",
      sendTime: "14:30",
    });

    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "camp-1",
        userId: "user-1",
        sendTime: "14:30:00",
      }),
    );
    expect(result.sendTime).toBe("14:30");
    expect(result.name).toBe("Aniversário");
  });

  it("deve atualizar parcialmente name e isActive", async () => {
    const { sut, repository } = makeUseCase();
    repository.getById.mockResolvedValue(existingConfig);
    repository.update.mockResolvedValue(undefined);

    const result = await sut.execute({
      id: "camp-1",
      userId: "user-1",
      name: "Nova campanha",
      isActive: false,
    });

    expect(repository.update).toHaveBeenCalledWith({
      id: "camp-1",
      userId: "user-1",
      name: "Nova campanha",
      isActive: false,
    });
    expect(result.name).toBe("Nova campanha");
    expect(result.isActive).toBe(false);
  });

  it("deve emitir birthdayMessageUpdate após persistir", async () => {
    const { sut, repository, appEventListener } = makeUseCase();
    repository.getById.mockResolvedValue(existingConfig);
    repository.update.mockResolvedValue(undefined);

    await sut.execute({
      id: "camp-1",
      userId: "user-1",
      messageTemplate: { textTemplate: "Feliz dia {{nome_paciente}}" },
    });

    expect(appEventListener.emit).toHaveBeenCalledWith(
      "birthdayMessageUpdate",
      expect.objectContaining({
        id: "camp-1",
        userId: "user-1",
        name: "Aniversário",
        sendTime: "09:00",
      }),
    );
  });

  it("deve lançar ApiError quando name for string vazia", async () => {
    const { sut, repository } = makeUseCase();
    repository.getById.mockResolvedValue(existingConfig);

    await expect(
      sut.execute({ id: "camp-1", userId: "user-1", name: "   " }),
    ).rejects.toThrow(ApiError);

    expect(repository.update).not.toHaveBeenCalled();
  });
});
