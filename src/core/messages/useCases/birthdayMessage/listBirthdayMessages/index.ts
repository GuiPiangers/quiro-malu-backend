import { birthdayMessageRepository } from "../../../../../repositories/messages/knexInstances";
import { ListBirthdayMessagesUseCase } from "./ListBirthdayMessagesUseCase";

const listBirthdayMessagesUseCase = new ListBirthdayMessagesUseCase(
  birthdayMessageRepository,
);

export { listBirthdayMessagesUseCase };
