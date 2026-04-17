import { BirthdayMessageRepository } from "../../../../../repositories/messages/BirthdayMessageRepository";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { CreateBirthdayMessageUseCase } from "./CreateBirthdayMessageUseCase";

const birthdayMessageRepository = new BirthdayMessageRepository();

const createBirthdayMessageUseCase = new CreateBirthdayMessageUseCase(
  birthdayMessageRepository,
  appEventListener,
);

export { createBirthdayMessageUseCase };
