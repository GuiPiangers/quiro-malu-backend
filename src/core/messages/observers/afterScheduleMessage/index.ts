import { afterScheduleQueue } from "../../../../queues/afterScheduleMessage";
import { appEventListener } from "../../../shared/observers/EventListener";
import { AfterScheduleMessageEventHandlers } from "./afterScheduleMessageEventHandlers";

const afterScheduleMessageEventHandlers = new AfterScheduleMessageEventHandlers(
  afterScheduleQueue,
  appEventListener,
);

export { afterScheduleMessageEventHandlers };
