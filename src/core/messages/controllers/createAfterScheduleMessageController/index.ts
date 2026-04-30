import { appEventListener } from "../../../shared/observers/EventListener";
import { CreateAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/createAfterScheduleMessage/CreateAfterScheduleMessageUseCase";
import { CreateAfterScheduleMessageController } from "./CreateAfterScheduleMessageController";
import { afterScheduleMessageRepository } from "../../../../repositories/messages/knexInstances";


const createAfterScheduleMessageUseCase = new CreateAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  appEventListener,
);

const createAfterScheduleMessageController = new CreateAfterScheduleMessageController(
  createAfterScheduleMessageUseCase,
);

export { createAfterScheduleMessageController };