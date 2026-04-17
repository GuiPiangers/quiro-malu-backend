import { createMockAfterScheduleMessageRepository } from "../../../../../../repositories/_mocks/AfterScheduleMessageRepositoryMock";
import { ListAfterScheduleMessagesUseCase } from "../ListAfterScheduleMessagesUseCase";

describe("ListAfterScheduleMessagesUseCase", () => {
  it("deve listar configs de mensagem pós-consulta com paginação padrão", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();

    afterScheduleMessageRepository.listByUserIdPaged.mockResolvedValue({
      items: [
        {
          id: "cfg-1",
          userId: "user-1",
          name: "Lista",
          minutesAfterSchedule: 30,
          textTemplate: "Olá {{nome}}",
          isActive: true,
        },
      ],
      total: 1,
    });

    const useCase = new ListAfterScheduleMessagesUseCase(afterScheduleMessageRepository);

    const result = await useCase.execute({ userId: "user-1" });

    expect(afterScheduleMessageRepository.listByUserIdPaged).toHaveBeenCalledWith({
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
        minutesAfterSchedule: 30,
        isActive: true,
        messageTemplate: {
          id: expect.any(String),
          textTemplate: "Olá {{nome}}",
        },
      },
    ]);
  });

  it("deve calcular offset a partir de page e limit", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();

    afterScheduleMessageRepository.listByUserIdPaged.mockResolvedValue({
      items: [],
      total: 40,
    });

    const useCase = new ListAfterScheduleMessagesUseCase(afterScheduleMessageRepository);

    const result = await useCase.execute({
      userId: "user-1",
      page: 2,
      limit: 15,
    });

    expect(afterScheduleMessageRepository.listByUserIdPaged).toHaveBeenCalledWith({
      userId: "user-1",
      limit: 15,
      offset: 15,
    });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(15);
    expect(result.total).toBe(40);
  });
});
