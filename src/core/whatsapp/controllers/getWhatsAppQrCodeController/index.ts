import { getWhatsAppQrCodeUseCase } from "../../useCases/getWhatsAppQrCode";
import { GetWhatsAppQrCodeController } from "./GetWhatsAppQrCodeController";

const getWhatsAppQrCodeController = new GetWhatsAppQrCodeController(
  getWhatsAppQrCodeUseCase,
);

export { getWhatsAppQrCodeController };
