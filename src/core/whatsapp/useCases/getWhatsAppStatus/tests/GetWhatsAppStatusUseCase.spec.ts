import { createMockWhatsAppInstanceRepository } from "../../../../../repositories/_mocks/WhatsAppInstanceRepositoryMock";
import { createMockWhatsAppProvider } from "../../../../../providers/whatsapp/_mocks/WhatsAppProviderMock";
import { GetWhatsAppStatusUseCase } from "../GetWhatsAppStatusUseCase";

describe("GetWhatsAppStatusUseCase", () => {
  let whatsAppInstanceRepository: ReturnType<
    typeof createMockWhatsAppInstanceRepository
  >;
  let whatsAppProvider: ReturnType<typeof createMockWhatsAppProvider>;
  let sut: GetWhatsAppStatusUseCase;

  const userId = "user-123";
  const instanceName = "clinic-user-123";

  beforeEach(() => {
    whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    whatsAppProvider = createMockWhatsAppProvider();
    sut = new GetWhatsAppStatusUseCase(
      whatsAppInstanceRepository,
      whatsAppProvider,
    );
  });

  it("deve retornar NOT_REGISTERED quando não há instância no banco", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue(null);

    const result = await sut.execute({ userId });

    expect(result).toEqual({ status: "NOT_REGISTERED" });
    expect(whatsAppProvider.getConnectionState).not.toHaveBeenCalled();
  });

  it("deve retornar CONNECTED quando o provider reporta open", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue({
      id: "inst-1",
      userId,
      instanceName,
    });
    whatsAppProvider.getConnectionState.mockResolvedValue("open");

    const result = await sut.execute({ userId });

    expect(result).toEqual({ status: "CONNECTED" });
    expect(whatsAppInstanceRepository.delete).not.toHaveBeenCalled();
  });

  it("deve retornar CONNECTING quando o provider reporta connecting", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue({
      id: "inst-1",
      userId,
      instanceName,
    });
    whatsAppProvider.getConnectionState.mockResolvedValue("connecting");

    const result = await sut.execute({ userId });

    expect(result).toEqual({ status: "CONNECTING" });
  });

  it("deve retornar DISCONNECTED quando o provider reporta close", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue({
      id: "inst-1",
      userId,
      instanceName,
    });
    whatsAppProvider.getConnectionState.mockResolvedValue("close");

    const result = await sut.execute({ userId });

    expect(result).toEqual({ status: "DISCONNECTED" });
  });
});
