import { createMockBeforeScheduleMessageRepository } from "../../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import { GetBeforeScheduleMessageUseCase } from "../GetBeforeScheduleMessageUseCase";
import { ApiError } from "../../../../../../utils/ApiError";

describe("GetBeforeScheduleMessageUseCase", () => {
  const userId = "user-1";
  const id = "msg-1";

  const makeUseCase = () => {
    const repository = createMockBeforeScheduleMessageRepository();
    const sut = new GetBeforeScheduleMessageUseCase(repository);
    return { sut, repository };
  };

  it("deve retornar o DTO do BeforeScheduleMessage quando encontrado", async () => {
    const { sut, repository } = makeUseCase();

    repository.getById.mockResolvedValue({
      id,
      userId,
      name: "Busca",
      minutesBeforeSchedule: 60,
      textTemplate: "Olá {{nome_paciente}}",
      isActive: true,
    });

    const result = await sut.execute({ id, userId });

    expect(repository.getById).toHaveBeenCalledWith({ id, userId });
    expect(result).toMatchObject({
      id,
      name: "Busca",
      minutesBeforeSchedule: 60,
      isActive: true,
      messageTemplate: { textTemplate: "Olá {{nome_paciente}}" },
    });
  });

  it("deve lançar ApiError 404 quando não encontrado", async () => {
    const { sut, repository } = makeUseCase();

    repository.getById.mockResolvedValue(null);

    await expect(sut.execute({ id, userId })).rejects.toThrow(ApiError);
  });
});
