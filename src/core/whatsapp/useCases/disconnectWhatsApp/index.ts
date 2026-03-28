import { EvolutionWhatsAppProvider } from "../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { KnexWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/KnexWhatsAppInstanceRepository";
import { DisconnectWhatsAppUseCase } from "./DisconnectWhatsAppUseCase";

const whatsAppInstanceRepository = new KnexWhatsAppInstanceRepository();
const whatsAppProvider = new EvolutionWhatsAppProvider(
  process.env.EVOLUTION_API_BASE_URL ?? "",
  process.env.AUTHENTICATION_API_KEY ?? "",
);

const disconnectWhatsAppUseCase = new DisconnectWhatsAppUseCase(
  whatsAppInstanceRepository,
  whatsAppProvider,
);

export { disconnectWhatsAppUseCase };
