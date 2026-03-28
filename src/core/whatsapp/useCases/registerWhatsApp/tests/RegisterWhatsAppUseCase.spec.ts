import { createMockWhatsAppInstanceRepository } from "../../../../../repositories/_mocks/WhatsAppInstanceRepositoryMock";
import { createMockWhatsAppProvider } from "../../../../../providers/whatsapp/_mocks/WhatsAppProviderMock";
import { RegisterWhatsAppUseCase } from "../RegisterWhatsAppUseCase";
import { ApiError } from "../../../../../utils/ApiError";

describe("RegisterWhatsAppUseCase", () => {
  let whatsAppInstanceRepository: ReturnType<
    typeof createMockWhatsAppInstanceRepository
  >;
  let whatsAppProvider: ReturnType<typeof createMockWhatsAppProvider>;
  let sut: RegisterWhatsAppUseCase;

  const userId = "user-123";
  const instanceName = `clinic-${userId}`;

  beforeEach(() => {
    whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    whatsAppProvider = createMockWhatsAppProvider();
    sut = new RegisterWhatsAppUseCase(
      whatsAppInstanceRepository,
      whatsAppProvider,
    );
  });

  it("deve criar nova instância e retornar QR code quando não existe instância prévia", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue(null);
    whatsAppProvider.createInstance.mockResolvedValue(undefined);
    whatsAppProvider.getQrCode.mockResolvedValue("base64-qr-code");

    const result = await sut.execute({ userId });

    expect(whatsAppProvider.createInstance).toHaveBeenCalledWith(instanceName);
    expect(whatsAppInstanceRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ userId, instanceName }),
    );
    expect(result).toEqual({ instanceName, qrCode: "base64-qr-code" });
  });

  it("deve retornar QR code quando instância existe mas provider reporta desconectado", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue({
      id: "inst-1",
      userId,
      instanceName,
    });
    whatsAppProvider.getConnectionState.mockResolvedValue("close");
    whatsAppProvider.getQrCode.mockResolvedValue("base64-qr-code");

    const result = await sut.execute({ userId });

    expect(whatsAppProvider.createInstance).not.toHaveBeenCalled();
    expect(whatsAppProvider.getConnectionState).toHaveBeenCalledWith(instanceName);
    expect(result).toEqual({ instanceName, qrCode: "base64-qr-code" });
  });

  it("deve lançar ApiError quando provider reporta instância conectada", async () => {
    whatsAppInstanceRepository.getByUserId.mockResolvedValue({
      id: "inst-1",
      userId,
      instanceName,
    });
    whatsAppProvider.getConnectionState.mockResolvedValue("open");

    await expect(sut.execute({ userId })).rejects.toThrow(ApiError);
    expect(whatsAppProvider.getQrCode).not.toHaveBeenCalled();
  });
});
