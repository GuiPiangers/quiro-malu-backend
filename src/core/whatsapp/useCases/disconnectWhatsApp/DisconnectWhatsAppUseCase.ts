import { IWhatsAppProvider } from "../../../../providers/whatsapp/IWhatsAppProvider";
import { IWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/IWhatsAppInstanceRepository";
import { ApiError } from "../../../../utils/ApiError";
import { WhatsAppInstance } from "../../models/WhatsAppInstance";

export type DisconnectWhatsAppDTO = {
  userId: string;
};

export class DisconnectWhatsAppUseCase {
  constructor(
    private whatsAppInstanceRepository: IWhatsAppInstanceRepository,
    private whatsAppProvider: IWhatsAppProvider,
  ) {}

  async execute({ userId }: DisconnectWhatsAppDTO): Promise<void> {
    const instanceDTO = await this.whatsAppInstanceRepository.getByUserId(userId);

    if (!instanceDTO) {
      throw new ApiError("Nenhuma instância de WhatsApp registrada", 404);
    }

    const instance = new WhatsAppInstance(instanceDTO);

    await this.whatsAppProvider.deleteInstance(instance.instanceName);
    await this.whatsAppInstanceRepository.delete(instance.id);
  }
}
