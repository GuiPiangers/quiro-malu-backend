import { CreateMessageCampaignUseCase } from "./createMessageCampaignUseCase";
import { MessageCampaignRepository } from "../../../../repositories/messageCampaign/MessageCampaignRepository";
import { MessageCampaign } from "../../models/MessageCampaign";
import { createMockMessageCampaignRepository } from "../../../../repositories/_mocks/MessageCampaignRepositoryMock";

jest.mock("../../models/MessageCampaign");

describe("CreateMessageCampaignUseCase", () => {
  let createMessageCampaignUseCase: CreateMessageCampaignUseCase;
  let messageCampaignRepository: jest.Mocked<MessageCampaignRepository>;

  beforeEach(() => {
    messageCampaignRepository = createMockMessageCampaignRepository();

    createMessageCampaignUseCase = new CreateMessageCampaignUseCase(
      messageCampaignRepository,
    );
  });

  it("deve criar uma campanha de mensagens e chamar o repositório", async () => {
    const messageCampaignDTO = {
      userId: "user-123",
      name: "Campanha de Teste",
      templateMessage: "Olá, essa é uma mensagem de teste!",
      active: true,
      triggers: [],
    };

    (MessageCampaign as jest.Mock).mockImplementation(() => {
      return {
        getDTO: jest.fn().mockReturnValue(messageCampaignDTO),
        watchTriggers: jest.fn(),
      };
    });

    await createMessageCampaignUseCase.execute(messageCampaignDTO);

    expect(messageCampaignRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-123",
        name: "Campanha de Teste",
        templateMessage: "Olá, essa é uma mensagem de teste!",
        active: true,
        triggers: [],
      }),
    );
  });

  it("deve instanciar a classe MessageCampaign corretamente", async () => {
    const messageCampaignDTO = {
      userId: "user-456",
      name: "Outra Campanha",
      templateMessage: "Mensagem de outra campanha",
      active: false,
      triggers: [],
    };

    await createMessageCampaignUseCase.execute(messageCampaignDTO);

    expect(MessageCampaign).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Outra Campanha",
        templateMessage: "Mensagem de outra campanha",
        active: false,
        triggers: [],
      }),
    );
  });

  it("deve chamar o método watchTriggers após criar a campanha", async () => {
    const watchTriggersMock = jest.fn();
    (MessageCampaign as jest.Mock).mockImplementation(() => {
      return {
        getDTO: jest.fn().mockReturnValue({}),
        watchTriggers: watchTriggersMock,
      };
    });

    await createMessageCampaignUseCase.execute({
      userId: "user-789",
      name: "Campanha com Gatilho",
      templateMessage: "Mensagem com gatilho",
      active: true,
      triggers: [],
    });

    expect(watchTriggersMock).toHaveBeenCalled();
  });
});
