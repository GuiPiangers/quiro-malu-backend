import { getWhatsAppStatusUseCase } from "../../useCases/getWhatsAppStatus";
import { GetWhatsAppStatusController } from "./GetWhatsAppStatusController";

const getWhatsAppStatusController = new GetWhatsAppStatusController(
  getWhatsAppStatusUseCase,
);

export { getWhatsAppStatusController };
