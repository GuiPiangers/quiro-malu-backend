import { appEventListener } from "../../../shared/observers/EventListener";
import { UpdateAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/updateAfterScheduleMessage/UpdateAfterScheduleMessageUseCase";
import { UpdateAfterScheduleMessageController } from "./UpdateAfterScheduleMessageController";
import { afterScheduleMessageRepository } from "../../../../repositories/messages/knexInstances";


const updateAfterScheduleMessageUseCase = new UpdateAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  appEventListener,
);

const updateAfterScheduleMessageController = new UpdateAfterScheduleMessageController(
  updateAfterScheduleMessageUseCase,
);

export { updateAfterScheduleMessageController };