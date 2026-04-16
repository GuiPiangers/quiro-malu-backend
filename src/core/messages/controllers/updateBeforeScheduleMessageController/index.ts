import { BeforeScheduleMessageRepository } from "../../../../repositories/messages/BeforeScheduleMessageRepository";
import { appEventListener } from "../../../shared/observers/EventListener";
import { UpdateBeforeScheduleMessageUseCase } from "../../useCases/beforeScheduleMessage/updateBeforeScheduleMessage/UpdateBeforeScheduleMessageUseCase";
import { UpdateBeforeScheduleMessageController } from "./UpdateBeforeScheduleMessageController";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();

const updateBeforeScheduleMessageUseCase = new UpdateBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  appEventListener,
);

const updateBeforeScheduleMessageController = new UpdateBeforeScheduleMessageController(
  updateBeforeScheduleMessageUseCase,
);

export { updateBeforeScheduleMessageController };
