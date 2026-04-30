import { appEventListener } from "../../../../shared/observers/EventListener";
import { UpdateBeforeScheduleMessageUseCase } from "./UpdateBeforeScheduleMessageUseCase";
import { beforeScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";


const updateBeforeScheduleMessageUseCase = new UpdateBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  appEventListener,
);

export { updateBeforeScheduleMessageUseCase };