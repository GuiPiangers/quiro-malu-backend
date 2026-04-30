import { appEventListener } from "../../../../shared/observers/EventListener";
import { UpdateAfterScheduleMessageUseCase } from "./UpdateAfterScheduleMessageUseCase";
import { afterScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";


const updateAfterScheduleMessageUseCase = new UpdateAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  appEventListener,
);

export { updateAfterScheduleMessageUseCase };