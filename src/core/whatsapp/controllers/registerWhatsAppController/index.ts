import { registerWhatsAppUseCase } from "../../useCases/registerWhatsApp";
import { RegisterWhatsAppController } from "./RegisterWhatsAppController";

const registerWhatsAppController = new RegisterWhatsAppController(
  registerWhatsAppUseCase,
);

export { registerWhatsAppController };
