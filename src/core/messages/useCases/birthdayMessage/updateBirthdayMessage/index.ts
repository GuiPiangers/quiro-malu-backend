import { appEventListener } from "../../../../shared/observers/EventListener";
import { BirthdayMessageRepository } from "../../../../../repositories/messages/BirthdayMessageRepository";
import { UpdateBirthdayMessageUseCase } from "./UpdateBirthdayMessageUseCase";

const birthdayMessageRepository = new BirthdayMessageRepository();

const updateBirthdayMessageUseCase = new UpdateBirthdayMessageUseCase(
  birthdayMessageRepository,
  appEventListener,
);

export { updateBirthdayMessageUseCase };
