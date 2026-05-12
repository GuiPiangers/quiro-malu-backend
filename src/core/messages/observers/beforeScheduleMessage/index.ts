import { beforeScheduleQueue } from "../../../../queues/beforeScheduleMessage";
import { beforeScheduleMessageRepository } from "../../../../repositories/messages/knexInstances";
import { appEventListener } from "../../../shared/observers/EventListener";
import { BeforeScheduleMessageEventHandlers } from "./beforeScheduleMessageEventHandlers";

const beforeScheduleMessageEventHandlers = new BeforeScheduleMessageEventHandlers(
  beforeScheduleQueue,
  appEventListener,
  beforeScheduleMessageRepository,
);

export { beforeScheduleMessageEventHandlers };
