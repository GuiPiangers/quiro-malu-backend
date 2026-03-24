import { beforeScheduleQueue } from "../../../../queues/beforeScheduleMessage";
import { appEventListener } from "../../../shared/observers/EventListener";
import { BeforeScheduleMessageEventHandlers } from "./beforeScheduleMessageEventHandlers";

const beforeScheduleMessageEventHandlers = new BeforeScheduleMessageEventHandlers(
  beforeScheduleQueue,
  appEventListener,
);

export { beforeScheduleMessageEventHandlers };
