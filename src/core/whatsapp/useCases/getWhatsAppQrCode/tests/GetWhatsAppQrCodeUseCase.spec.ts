import { createMockWhatsAppInstanceRepository } from "../../../../../repositories/_mocks/WhatsAppInstanceRepositoryMock";
import { createMockWhatsAppProvider } from "../../../../../providers/whatsapp/_mocks/WhatsAppProviderMock";
import { GetWhatsAppQrCodeUseCase } from "../GetWhatsAppQrCodeUseCase";
import { ApiError } from "../../../../../utils/ApiError";

describe("GetWhatsAppQrCodeUseCase", () => {
  let whatsAppInstanceRepository: ReturnType<
    typeof createMockWhatsAppInstanceRepository
  >;
  let whatsAppProvider: ReturnType<typeof createMockWhatsAppProvider>;
  let sut: GetWhatsAppQrCodeUseCase;

  const userId = "user-123";
  const instanceName = "clinic-user-123";

  beforeEach(() => {
    whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    whatsAppProvider = createMockWhatsAppProvider();
    sut = new GetWhatsAppQrCodeUseCase(
      whatsAppInstanceRepository,
      whatsAppProvider,
    );
  });

  it("deve lançar ApiError se não existe instância registrada", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue(null);

    await expect(sut.execute({ userId })).rejects.toThrow(ApiError);
    expect(whatsAppProvider.getConnectionState).not.toHaveBeenCalled();
  });

  it("deve retornar CONNECTED e qrCode null quando o provider reporta conexão aberta", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue({
      id: "inst-1",
      userId,
      instanceName,
    });
    whatsAppProvider.getConnectionState.mockResolvedValue("open");

    const result = await sut.execute({ userId });

    expect(whatsAppProvider.getConnectionState).toHaveBeenCalledWith(instanceName);
    expect(whatsAppProvider.getQrCode).not.toHaveBeenCalled();
    expect(result).toEqual({ status: "CONNECTED", qrCode: null });
  });

  it("deve buscar e retornar o QR code quando o provider reporta conexão fechada", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue({
      id: "inst-1",
      userId,
      instanceName,
    });
    whatsAppProvider.getConnectionState.mockResolvedValue("close");
    whatsAppProvider.getQrCode.mockResolvedValue("base64-qr-code");

    const result = await sut.execute({ userId });

    expect(whatsAppProvider.getQrCode).toHaveBeenCalledWith(instanceName);
    expect(result).toEqual({ status: "PENDING", qrCode: "base64-qr-code" });
  });

  it("deve buscar e retornar o QR code quando o provider reporta conexão em andamento", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue({
      id: "inst-1",
      userId,
      instanceName,
    });
    whatsAppProvider.getConnectionState.mockResolvedValue("connecting");
    whatsAppProvider.getQrCode.mockResolvedValue("base64-qr-code");

    const result = await sut.execute({ userId });

    expect(result).toEqual({ status: "PENDING", qrCode: "base64-qr-code" });
  });
});
