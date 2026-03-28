import { createMockWhatsAppInstanceRepository } from "../../../../../repositories/_mocks/WhatsAppInstanceRepositoryMock";
import { createMockWhatsAppProvider } from "../../../../../providers/whatsapp/_mocks/WhatsAppProviderMock";
import { DisconnectWhatsAppUseCase } from "../DisconnectWhatsAppUseCase";
import { ApiError } from "../../../../../utils/ApiError";

describe("DisconnectWhatsAppUseCase", () => {
  let whatsAppInstanceRepository: ReturnType<
    typeof createMockWhatsAppInstanceRepository
  >;
  let whatsAppProvider: ReturnType<typeof createMockWhatsAppProvider>;
  let sut: DisconnectWhatsAppUseCase;

  const userId = "user-123";
  const instanceName = "clinic-user-123";

  beforeEach(() => {
    whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    whatsAppProvider = createMockWhatsAppProvider();
    sut = new DisconnectWhatsAppUseCase(
      whatsAppInstanceRepository,
      whatsAppProvider,
    );
  });

  it("deve lançar ApiError se não existe instância registrada", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue(null);

    await expect(sut.execute({ userId })).rejects.toThrow(ApiError);
    expect(whatsAppProvider.deleteInstance).not.toHaveBeenCalled();
  });

  it("deve chamar deleteInstance no provider e deletar o registro do banco", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue({
      id: "inst-1",
      userId,
      instanceName,
    });
    whatsAppProvider.deleteInstance.mockResolvedValue(undefined);

    await sut.execute({ userId });

    expect(whatsAppProvider.deleteInstance).toHaveBeenCalledWith(instanceName);
    expect(whatsAppInstanceRepository.delete).toHaveBeenCalledWith("inst-1");
  });
});
