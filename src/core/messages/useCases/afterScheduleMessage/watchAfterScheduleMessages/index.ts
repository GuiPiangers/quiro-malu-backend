import { AfterScheduleMessageRepository } from "../../../../../repositories/messages/AfterScheduleMessageRepository";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { WatchAfterScheduleMessagesUseCase } from "./WatchAfterScheduleMessagesUseCase";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();

const watchAfterScheduleMessagesUseCase = new WatchAfterScheduleMessagesUseCase(
  afterScheduleMessageRepository,
  appEventListener,
);

export { watchAfterScheduleMessagesUseCase };
