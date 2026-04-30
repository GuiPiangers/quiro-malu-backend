import { createMockBirthdayMessageRepository } from "../../../../../../repositories/_mocks/BirthdayMessageRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { DeleteBirthdayMessageUseCase } from "../DeleteBirthdayMessageUseCase";

describe("DeleteBirthdayMessageUseCase", () => {
  const makeSut = () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();
    const appEventListener = { emit: vi.fn() };

    const sut = new DeleteBirthdayMessageUseCase(
      birthdayMessageRepository,
      appEventListener as any,
    );

    return { sut, birthdayMessageRepository, appEventListener };
  };

  it("deve lançar ApiError 404 quando a campanha não existir", async () => {
    const { sut, birthdayMessageRepository } = makeSut();
    birthdayMessageRepository.getById.mockResolvedValue(null);

    await expect(sut.execute({ id: "camp-1", userId: "user-1" })).rejects.toThrow(
      ApiError,
    );

    expect(birthdayMessageRepository.delete).not.toHaveBeenCalled();
  });

  it("deve remover do banco e emitir birthdayMessageDelete", async () => {
    const { sut, birthdayMessageRepository, appEventListener } = makeSut();

    birthdayMessageRepository.getById.mockResolvedValue({
      id: "camp-1",
      userId: "user-1",
      name: "Aniversário",
      textTemplate: "Olá",
      isActive: true,
      sendTime: "09:00",
    });
    birthdayMessageRepository.delete.mockResolvedValue(undefined);

    await sut.execute({ id: "camp-1", userId: "user-1" });

    expect(birthdayMessageRepository.delete).toHaveBeenCalledWith({
      id: "camp-1",
      userId: "user-1",
    });
    expect(appEventListener.emit).toHaveBeenCalledWith("birthdayMessageDelete", {
      id: "camp-1",
    });
  });
});
