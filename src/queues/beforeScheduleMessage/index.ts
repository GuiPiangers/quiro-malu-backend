import { sendBeforeScheduleMessageUseCase } from "../../core/messages/useCases/beforeScheduleMessage/sendBeforeScheduleMessage";
import { QueueProvider } from "../../repositories/queueProvider/queueProvider";
import { SendBeforeScheduleMessageJob } from "../../core/messages/useCases/beforeScheduleMessage/sendBeforeScheduleMessage/sendBeforeScheduleMessageUseCase";
import { BeforeScheduleQueue } from "./BeforeScheduleQueue";

const queueProvider = new QueueProvider<SendBeforeScheduleMessageJob>(
  "beforeScheduleMessage",
);

const beforeScheduleQueue = new BeforeScheduleQueue(
  queueProvider,
  sendBeforeScheduleMessageUseCase,
);

export { beforeScheduleQueue };
