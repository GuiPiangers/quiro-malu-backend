import { appEventListener } from "../../../../shared/observers/EventListener";
import { birthdayMessageRepository } from "../../../../../repositories/messages/knexInstances";
import { UpdateBirthdayMessageUseCase } from "./UpdateBirthdayMessageUseCase";

const updateBirthdayMessageUseCase = new UpdateBirthdayMessageUseCase(
  birthdayMessageRepository,
  appEventListener,
);

export { updateBirthdayMessageUseCase };
