import { appEventListener } from "../../../shared/observers/EventListener";
import { CreateBeforeScheduleMessageUseCase } from "../../useCases/beforeScheduleMessage/createBeforeScheduleMessage/CreateBeforeScheduleMessageUseCase";
import { CreateBeforeScheduleMessageController } from "./CreateBeforeScheduleMessageController";
import { beforeScheduleMessageRepository } from "../../../../repositories/messages/knexInstances";


const createBeforeScheduleMessageUseCase = new CreateBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  appEventListener,
);

const createBeforeScheduleMessageController = new CreateBeforeScheduleMessageController(
  createBeforeScheduleMessageUseCase,
);

export { createBeforeScheduleMessageController };