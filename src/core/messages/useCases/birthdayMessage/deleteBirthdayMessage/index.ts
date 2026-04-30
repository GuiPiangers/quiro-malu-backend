import { appEventListener } from "../../../../shared/observers/EventListener";
import { birthdayMessageRepository } from "../../../../../repositories/messages/knexInstances";
import { DeleteBirthdayMessageUseCase } from "./DeleteBirthdayMessageUseCase";

const deleteBirthdayMessageUseCase = new DeleteBirthdayMessageUseCase(
  birthdayMessageRepository,
  appEventListener,
);

export { deleteBirthdayMessageUseCase };
