import { randomUUID } from "crypto";
import { IWhatsAppProvider } from "../../../../providers/whatsapp/IWhatsAppProvider";
import { IWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/IWhatsAppInstanceRepository";
import { ApiError } from "../../../../utils/ApiError";
import { WhatsAppInstance } from "../../models/WhatsAppInstance";

export type RegisterWhatsAppDTO = {
  userId: string;
};

export type RegisterWhatsAppResult = {
  instanceName: string;
  qrCode: string | null;
};

export class RegisterWhatsAppUseCase {
  constructor(
    private whatsAppInstanceRepository: IWhatsAppInstanceRepository,
    private whatsAppProvider: IWhatsAppProvider,
  ) {}

  async execute({ userId }: RegisterWhatsAppDTO): Promise<RegisterWhatsAppResult> {
    const existingDTO = await this.whatsAppInstanceRepository.getByUserId(userId);

    if (existingDTO) {
      const existing = new WhatsAppInstance(existingDTO);

      const connectionState = await this.whatsAppProvider.getConnectionState(
        existing.instanceName,
      );

      if (connectionState === "open") {
        throw new ApiError("WhatsApp já está conectado para esta clínica", 409);
      }

      const qrCode = await this.whatsAppProvider.getQrCode(existing.instanceName);
      return { instanceName: existing.instanceName, qrCode };
    }

    const instanceName = `clinic-${userId}`;
    await this.whatsAppProvider.createInstance(instanceName);

    const newInstance = new WhatsAppInstance({
      id: randomUUID(),
      userId,
      instanceName,
    });

    await this.whatsAppInstanceRepository.save(newInstance.getDTO());

    const qrCode = await this.whatsAppProvider.getQrCode(newInstance.instanceName);
    return { instanceName: newInstance.instanceName, qrCode };
  }
}
