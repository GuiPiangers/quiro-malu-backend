import { appEventListener } from "../../../shared/observers/EventListener";
import { BirthdayMessageRepository } from "../../../../repositories/messages/BirthdayMessageRepository";
import { CreateBirthdayMessageUseCase } from "../../useCases/birthdayMessage/createBirthdayMessage/CreateBirthdayMessageUseCase";
import { CreateBirthdayMessageController } from "./CreateBirthdayMessageController";

const birthdayMessageRepository = new BirthdayMessageRepository();

const createBirthdayMessageUseCase = new CreateBirthdayMessageUseCase(
  birthdayMessageRepository,
  appEventListener,
);

const createBirthdayMessageController = new CreateBirthdayMessageController(
  createBirthdayMessageUseCase,
);

export { createBirthdayMessageController };
