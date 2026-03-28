import { IWhatsAppProvider } from "../../../../providers/whatsapp/IWhatsAppProvider";
import { IWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/IWhatsAppInstanceRepository";
import { WhatsAppInstance } from "../../models/WhatsAppInstance";

export type GetWhatsAppStatusDTO = {
  userId: string;
};

export type GetWhatsAppStatusResult = {
  status: "NOT_REGISTERED" | "CONNECTED" | "CONNECTING" | "DISCONNECTED";
};

const providerStateMap = {
  open: "CONNECTED",
  connecting: "CONNECTING",
  close: "DISCONNECTED",
} as const;

export class GetWhatsAppStatusUseCase {
  constructor(
    private whatsAppInstanceRepository: IWhatsAppInstanceRepository,
    private whatsAppProvider: IWhatsAppProvider,
  ) {}

  async execute({ userId }: GetWhatsAppStatusDTO): Promise<GetWhatsAppStatusResult> {
    const instanceDTO = await this.whatsAppInstanceRepository.getByUserId(userId);

    if (!instanceDTO) {
      return { status: "NOT_REGISTERED" };
    }

    const instance = new WhatsAppInstance(instanceDTO);

    const providerState = await this.whatsAppProvider.getConnectionState(
      instance.instanceName,
    );

    return { status: providerStateMap[providerState] };
  }
}
