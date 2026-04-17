import { IWhatsAppProvider } from "../../../providers/whatsapp/IWhatsAppProvider";
import { IWhatsAppInstanceRepository } from "../../../repositories/whatsapp/IWhatsAppInstanceRepository";
import { ApiError } from "../../../utils/ApiError";
import { WhatsAppInstance } from "../../whatsapp/models/WhatsAppInstance";

export async function getConnectedWhatsAppInstance({
  userId,
  whatsAppInstanceRepository,
  whatsAppProvider,
}: {
  userId: string;
  whatsAppInstanceRepository: IWhatsAppInstanceRepository;
  whatsAppProvider: IWhatsAppProvider;
}): Promise<WhatsAppInstance> {
  const instanceDTO = await whatsAppInstanceRepository.getByUserId(userId);

  if (!instanceDTO) {
    throw new ApiError("WhatsApp não conectado para esta clínica", 422);
  }

  const instance = new WhatsAppInstance(instanceDTO);

  const connectionState = await whatsAppProvider.getConnectionState(
    instance.instanceName,
  );

  if (connectionState !== "open") {
    throw new ApiError("WhatsApp não conectado para esta clínica", 422);
  }

  return instance;
}
