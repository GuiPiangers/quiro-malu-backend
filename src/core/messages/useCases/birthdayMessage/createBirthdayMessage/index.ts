import { birthdayMessageRepository } from "../../../../../repositories/messages/knexInstances";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { CreateBirthdayMessageUseCase } from "./CreateBirthdayMessageUseCase";

const createBirthdayMessageUseCase = new CreateBirthdayMessageUseCase(
  birthdayMessageRepository,
  appEventListener,
);

export { createBirthdayMessageUseCase };
