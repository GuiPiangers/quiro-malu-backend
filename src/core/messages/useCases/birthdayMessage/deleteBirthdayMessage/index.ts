import { appEventListener } from "../../../../shared/observers/EventListener";
import { BirthdayMessageRepository } from "../../../../../repositories/messages/BirthdayMessageRepository";
import { DeleteBirthdayMessageUseCase } from "./DeleteBirthdayMessageUseCase";

const birthdayMessageRepository = new BirthdayMessageRepository();

const deleteBirthdayMessageUseCase = new DeleteBirthdayMessageUseCase(
  birthdayMessageRepository,
  appEventListener,
);

export { deleteBirthdayMessageUseCase };
