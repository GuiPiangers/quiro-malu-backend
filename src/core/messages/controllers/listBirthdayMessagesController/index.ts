import { listBirthdayMessagesUseCase } from "../../useCases/birthdayMessage/listBirthdayMessages";
import { ListBirthdayMessagesController } from "./ListBirthdayMessagesController";

const listBirthdayMessagesController = new ListBirthdayMessagesController(
  listBirthdayMessagesUseCase,
);

export { listBirthdayMessagesController };
