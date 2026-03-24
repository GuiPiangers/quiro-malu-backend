import { CreateMessageCampaignUseCase } from "./createMessageCampaignUseCase";
import { MessageCampaign } from "../../models/MessageCampaign";
import { createMockMessageCampaignRepository } from "../../../../repositories/_mocks/MessageCampaignRepositoryMock";

jest.mock("../../models/MessageCampaign");

describe("CreateMessageCampaignUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a campaign and call the repository", async () => {
    const messageCampaignRepository = createMockMessageCampaignRepository();

    const registerMessageCampaignUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as any;

    const useCase = new CreateMessageCampaignUseCase(
      messageCampaignRepository,
      registerMessageCampaignUseCase,
    );

    const messageCampaignDTO = {
      userId: "user-123",
      name: "Campanha de Teste",
      templateMessage: "Olá, essa é uma mensagem de teste.",
      active: true,
      triggers: [],
    };

    (MessageCampaign as any).mockImplementation(() => {
      return {
        getDTO: jest.fn().mockReturnValue({
          name: messageCampaignDTO.name,
          templateMessage: messageCampaignDTO.templateMessage,
          active: messageCampaignDTO.active,
          triggers: messageCampaignDTO.triggers,
        }),
      };
    });

    await useCase.execute(messageCampaignDTO as any);

    expect(messageCampaignRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-123",
        name: "Campanha de Teste",
        templateMessage: "Olá, essa é uma mensagem de teste.",
        active: true,
        triggers: [],
      }),
    );
  });

  it("should call RegisterMessageCampaignUseCase after create", async () => {
    const messageCampaignRepository = createMockMessageCampaignRepository();

    const registerMessageCampaignUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as any;

    const useCase = new CreateMessageCampaignUseCase(
      messageCampaignRepository,
      registerMessageCampaignUseCase,
    );

    (MessageCampaign as any).mockImplementation(() => {
      return {
        getDTO: jest.fn().mockReturnValue({
          id: "campaign-1",
          name: "Campanha",
          templateMessage: "Mensagem",
          active: true,
          triggers: [],
        }),
      };
    });

    await useCase.execute({
      userId: "user-1",
      name: "Campanha",
      templateMessage: "Mensagem",
      active: true,
      triggers: [],
    } as any);

    expect(registerMessageCampaignUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
      }),
    );
  });
});
