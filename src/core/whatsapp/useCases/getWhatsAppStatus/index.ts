import { EvolutionWhatsAppProvider } from "../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { GetWhatsAppStatusUseCase } from "./GetWhatsAppStatusUseCase";
import { knexWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/knexInstances";

const whatsAppInstanceRepository = knexWhatsAppInstanceRepository;
const whatsAppProvider = new EvolutionWhatsAppProvider(
  process.env.EVOLUTION_API_BASE_URL ?? "",
  process.env.AUTHENTICATION_API_KEY ?? "",
);

const getWhatsAppStatusUseCase = new GetWhatsAppStatusUseCase(
  whatsAppInstanceRepository,
  whatsAppProvider,
);

export { getWhatsAppStatusUseCase };