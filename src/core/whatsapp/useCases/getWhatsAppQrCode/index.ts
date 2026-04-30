import { EvolutionWhatsAppProvider } from "../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { GetWhatsAppQrCodeUseCase } from "./GetWhatsAppQrCodeUseCase";
import { knexWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/knexInstances";

const whatsAppInstanceRepository = knexWhatsAppInstanceRepository;
const whatsAppProvider = new EvolutionWhatsAppProvider(
  process.env.EVOLUTION_API_BASE_URL ?? "",
  process.env.AUTHENTICATION_API_KEY ?? "",
);

const getWhatsAppQrCodeUseCase = new GetWhatsAppQrCodeUseCase(
  whatsAppInstanceRepository,
  whatsAppProvider,
);

export { getWhatsAppQrCodeUseCase };