import { appEventListener } from "../../../../shared/observers/EventListener";
import { CreateBeforeScheduleMessageUseCase } from "./CreateBeforeScheduleMessageUseCase";
import { beforeScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";


const createBeforeScheduleMessageUseCase = new CreateBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  appEventListener,
);

export { createBeforeScheduleMessageUseCase };