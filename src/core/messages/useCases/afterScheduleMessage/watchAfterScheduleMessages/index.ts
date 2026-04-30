import { appEventListener } from "../../../../shared/observers/EventListener";
import { WatchAfterScheduleMessagesUseCase } from "./WatchAfterScheduleMessagesUseCase";
import { afterScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";


const watchAfterScheduleMessagesUseCase = new WatchAfterScheduleMessagesUseCase(
  afterScheduleMessageRepository,
  appEventListener,
);

export { watchAfterScheduleMessagesUseCase };