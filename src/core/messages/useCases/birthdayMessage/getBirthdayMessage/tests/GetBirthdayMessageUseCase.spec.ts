import { createMockBirthdayMessageRepository } from "../../../../../../repositories/_mocks/BirthdayMessageRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { GetBirthdayMessageUseCase } from "../GetBirthdayMessageUseCase";

describe("GetBirthdayMessageUseCase", () => {
  const userId = "user-1";
  const id = "camp-1";

  const makeUseCase = () => {
    const repository = createMockBirthdayMessageRepository();
    const sut = new GetBirthdayMessageUseCase(repository);
    return { sut, repository };
  };

  it("deve retornar o DTO da campanha quando encontrada", async () => {
    const { sut, repository } = makeUseCase();

    repository.getById.mockResolvedValue({
      id,
      userId,
      name: "Aniversário",
      textTemplate: "Olá {{nome_paciente}}",
      isActive: true,
      sendTime: "09:00",
    });

    const result = await sut.execute({ id, userId });

    expect(repository.getById).toHaveBeenCalledWith({ id, userId });
    expect(result).toMatchObject({
      id,
      name: "Aniversário",
      isActive: true,
      sendTime: "09:00",
      messageTemplate: { textTemplate: "Olá {{nome_paciente}}" },
    });
  });

  it("deve lançar ApiError 404 quando não encontrada", async () => {
    const { sut, repository } = makeUseCase();

    repository.getById.mockResolvedValue(null);

    await expect(sut.execute({ id, userId })).rejects.toThrow(ApiError);
  });
});
