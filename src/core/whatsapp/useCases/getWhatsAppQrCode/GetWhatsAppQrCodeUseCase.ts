import { IWhatsAppProvider } from "../../../../providers/whatsapp/IWhatsAppProvider";
import { IWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/IWhatsAppInstanceRepository";
import { ApiError } from "../../../../utils/ApiError";
import { WhatsAppInstance } from "../../models/WhatsAppInstance";

export type GetWhatsAppQrCodeDTO = {
  userId: string;
};

export type GetWhatsAppQrCodeResult = {
  status: "CONNECTED" | "PENDING";
  qrCode: string | null;
};

export class GetWhatsAppQrCodeUseCase {
  constructor(
    private whatsAppInstanceRepository: IWhatsAppInstanceRepository,
    private whatsAppProvider: IWhatsAppProvider,
  ) {}

  async execute({ userId }: GetWhatsAppQrCodeDTO): Promise<GetWhatsAppQrCodeResult> {
    const instanceDTO = await this.whatsAppInstanceRepository.getByUserId(userId);

    if (!instanceDTO) {
      throw new ApiError("Nenhuma instância de WhatsApp registrada", 404);
    }

    const instance = new WhatsAppInstance(instanceDTO);

    const connectionState = await this.whatsAppProvider.getConnectionState(
      instance.instanceName,
    );

    if (connectionState === "open") {
      return { status: "CONNECTED", qrCode: null };
    }

    const qrCode = await this.whatsAppProvider.getQrCode(instance.instanceName);
    return { status: "PENDING", qrCode };
  }
}
