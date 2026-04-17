import { BirthdayMessageRepository } from "../../../../../repositories/messages/BirthdayMessageRepository";
import { ListBirthdayMessagesUseCase } from "./ListBirthdayMessagesUseCase";

const birthdayMessageRepository = new BirthdayMessageRepository();

const listBirthdayMessagesUseCase = new ListBirthdayMessagesUseCase(
  birthdayMessageRepository,
);

export { listBirthdayMessagesUseCase };
