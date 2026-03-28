import { disconnectWhatsAppUseCase } from "../../useCases/disconnectWhatsApp";
import { DisconnectWhatsAppController } from "./DisconnectWhatsAppController";

const disconnectWhatsAppController = new DisconnectWhatsAppController(
  disconnectWhatsAppUseCase,
);

export { disconnectWhatsAppController };
