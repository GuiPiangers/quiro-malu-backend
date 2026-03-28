import { EvolutionWhatsAppProvider } from "../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { KnexWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/KnexWhatsAppInstanceRepository";
import { GetWhatsAppStatusUseCase } from "./GetWhatsAppStatusUseCase";

const whatsAppInstanceRepository = new KnexWhatsAppInstanceRepository();
const whatsAppProvider = new EvolutionWhatsAppProvider(
  process.env.EVOLUTION_API_BASE_URL ?? "",
  process.env.AUTHENTICATION_API_KEY ?? "",
);

const getWhatsAppStatusUseCase = new GetWhatsAppStatusUseCase(
  whatsAppInstanceRepository,
  whatsAppProvider,
);

export { getWhatsAppStatusUseCase };
