import { EvolutionWhatsAppProvider } from "../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { RegisterWhatsAppUseCase } from "./RegisterWhatsAppUseCase";
import { knexWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/knexInstances";

const whatsAppInstanceRepository = knexWhatsAppInstanceRepository;
const whatsAppProvider = new EvolutionWhatsAppProvider(
  process.env.EVOLUTION_API_BASE_URL ?? "",
  process.env.AUTHENTICATION_API_KEY ?? "",
);

const registerWhatsAppUseCase = new RegisterWhatsAppUseCase(
  whatsAppInstanceRepository,
  whatsAppProvider,
);

export { registerWhatsAppUseCase };