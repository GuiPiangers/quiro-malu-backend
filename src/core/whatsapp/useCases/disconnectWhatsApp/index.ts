import { EvolutionWhatsAppProvider } from "../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { DisconnectWhatsAppUseCase } from "./DisconnectWhatsAppUseCase";
import { knexWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/knexInstances";

const whatsAppInstanceRepository = knexWhatsAppInstanceRepository;
const whatsAppProvider = new EvolutionWhatsAppProvider(
  process.env.EVOLUTION_API_BASE_URL ?? "",
  process.env.AUTHENTICATION_API_KEY ?? "",
);

const disconnectWhatsAppUseCase = new DisconnectWhatsAppUseCase(
  whatsAppInstanceRepository,
  whatsAppProvider,
);

export { disconnectWhatsAppUseCase };