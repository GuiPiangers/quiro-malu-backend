import { appEventListener } from "../../../shared/observers/EventListener";
import { birthdayMessageRepository } from "../../../../repositories/messages/knexInstances";
import { CreateBirthdayMessageUseCase } from "../../useCases/birthdayMessage/createBirthdayMessage/CreateBirthdayMessageUseCase";
import { CreateBirthdayMessageController } from "./CreateBirthdayMessageController";

const createBirthdayMessageUseCase = new CreateBirthdayMessageUseCase(
  birthdayMessageRepository,
  appEventListener,
);

const createBirthdayMessageController = new CreateBirthdayMessageController(
  createBirthdayMessageUseCase,
);

export { createBirthdayMessageController };
