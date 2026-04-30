import { appEventListener } from "../../../../shared/observers/EventListener";
import { CreateAfterScheduleMessageUseCase } from "./CreateAfterScheduleMessageUseCase";
import { afterScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";


const createAfterScheduleMessageUseCase = new CreateAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  appEventListener,
);

export { createAfterScheduleMessageUseCase };