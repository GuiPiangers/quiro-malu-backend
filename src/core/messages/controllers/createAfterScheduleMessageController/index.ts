import { appEventListener } from "../../../shared/observers/EventListener";
import { AfterScheduleMessageRepository } from "../../../../repositories/messages/AfterScheduleMessageRepository";
import { CreateAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/createAfterScheduleMessage/CreateAfterScheduleMessageUseCase";
import { CreateAfterScheduleMessageController } from "./CreateAfterScheduleMessageController";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();

const createAfterScheduleMessageUseCase = new CreateAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  appEventListener,
);

const createAfterScheduleMessageController = new CreateAfterScheduleMessageController(
  createAfterScheduleMessageUseCase,
);

export { createAfterScheduleMessageController };
