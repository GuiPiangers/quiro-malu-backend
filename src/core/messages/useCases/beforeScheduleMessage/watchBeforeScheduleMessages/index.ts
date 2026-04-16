import { BeforeScheduleMessageRepository } from "../../../../../repositories/messages/BeforeScheduleMessageRepository";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { WatchBeforeScheduleMessagesUseCase } from "./watchBeforeScheduleMessagesUseCase";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();

const watchBeforeScheduleMessagesUseCase = new WatchBeforeScheduleMessagesUseCase(
  beforeScheduleMessageRepository,
  appEventListener,
);

export { watchBeforeScheduleMessagesUseCase };
