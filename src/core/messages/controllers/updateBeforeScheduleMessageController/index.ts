import { appEventListener } from "../../../shared/observers/EventListener";
import { UpdateBeforeScheduleMessageUseCase } from "../../useCases/beforeScheduleMessage/updateBeforeScheduleMessage/UpdateBeforeScheduleMessageUseCase";
import { UpdateBeforeScheduleMessageController } from "./UpdateBeforeScheduleMessageController";
import { beforeScheduleMessageRepository } from "../../../../repositories/messages/knexInstances";


const updateBeforeScheduleMessageUseCase = new UpdateBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  appEventListener,
);

const updateBeforeScheduleMessageController = new UpdateBeforeScheduleMessageController(
  updateBeforeScheduleMessageUseCase,
);

export { updateBeforeScheduleMessageController };