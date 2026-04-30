import { appEventListener } from "../../../../shared/observers/EventListener";
import { WatchBeforeScheduleMessagesUseCase } from "./watchBeforeScheduleMessagesUseCase";
import { beforeScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";


const watchBeforeScheduleMessagesUseCase = new WatchBeforeScheduleMessagesUseCase(
  beforeScheduleMessageRepository,
  appEventListener,
);

export { watchBeforeScheduleMessagesUseCase };