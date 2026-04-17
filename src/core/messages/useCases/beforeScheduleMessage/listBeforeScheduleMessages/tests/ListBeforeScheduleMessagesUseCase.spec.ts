import { createMockBeforeScheduleMessageRepository } from "../../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import { ListBeforeScheduleMessagesUseCase } from "../ListBeforeScheduleMessagesUseCase";

describe("ListBeforeScheduleMessagesUseCase", () => {
  it("deve listar configs de mensagem pré-consulta com paginação padrão", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();

    beforeScheduleMessageRepository.listByUserIdPaged.mockResolvedValue({
      items: [
        {
          id: "cfg-1",
          userId: "user-1",
          name: "Lista",
          minutesBeforeSchedule: 30,
          textTemplate: "Olá {{nome}}",
          isActive: true,
        },
      ],
      total: 1,
    });

    const useCase = new ListBeforeScheduleMessagesUseCase(
      beforeScheduleMessageRepository,
    );

    const result = await useCase.execute({ userId: "user-1" });

    expect(beforeScheduleMessageRepository.listByUserIdPaged).toHaveBeenCalledWith({
      userId: "user-1",
      limit: 20,
      offset: 0,
    });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.total).toBe(1);
    expect(result.items).toEqual([
      {
        id: "cfg-1",
        name: "Lista",
        minutesBeforeSchedule: 30,
        isActive: true,
        messageTemplate: {
          id: expect.any(String),
          textTemplate: "Olá {{nome}}",
        },
      },
    ]);
  });

  it("deve calcular offset a partir de page e limit", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();

    beforeScheduleMessageRepository.listByUserIdPaged.mockResolvedValue({
      items: [],
      total: 25,
    });

    const useCase = new ListBeforeScheduleMessagesUseCase(
      beforeScheduleMessageRepository,
    );

    const result = await useCase.execute({
      userId: "user-1",
      page: 2,
      limit: 10,
    });

    expect(beforeScheduleMessageRepository.listByUserIdPaged).toHaveBeenCalledWith({
      userId: "user-1",
      limit: 10,
      offset: 10,
    });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(25);
  });
});
