import { createMockBirthdayMessageRepository } from "../../../../../../repositories/_mocks/BirthdayMessageRepositoryMock";
import { ListBirthdayMessagesUseCase } from "../ListBirthdayMessagesUseCase";

describe("ListBirthdayMessagesUseCase", () => {
  it("deve listar campanhas de aniversário com paginação padrão", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();

    birthdayMessageRepository.listByUserIdPaged.mockResolvedValue({
      items: [
        {
          id: "cfg-1",
          userId: "user-1",
          name: "Campanha A",
          textTemplate: "Olá {{nome_paciente}}",
          isActive: true,
          sendTime: "09:00",
        },
      ],
      total: 1,
    });

    const useCase = new ListBirthdayMessagesUseCase(birthdayMessageRepository);

    const result = await useCase.execute({ userId: "user-1" });

    expect(birthdayMessageRepository.listByUserIdPaged).toHaveBeenCalledWith({
      userId: "user-1",
      limit: 20,
      offset: 0,
    });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: "cfg-1",
      name: "Campanha A",
      isActive: true,
      sendTime: "09:00",
      messageTemplate: {
        id: expect.any(String),
        textTemplate: "Olá {{nome_paciente}}",
      },
    });
  });

  it("deve calcular offset a partir de page e limit", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();

    birthdayMessageRepository.listByUserIdPaged.mockResolvedValue({
      items: [],
      total: 50,
    });

    const useCase = new ListBirthdayMessagesUseCase(birthdayMessageRepository);

    const result = await useCase.execute({
      userId: "user-1",
      page: 3,
      limit: 10,
    });

    expect(birthdayMessageRepository.listByUserIdPaged).toHaveBeenCalledWith({
      userId: "user-1",
      limit: 10,
      offset: 20,
    });

    expect(result.page).toBe(3);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(50);
  });
});
