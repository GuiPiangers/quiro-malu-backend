import { sendAfterScheduleMessageUseCase } from "../../core/messages/useCases/afterScheduleMessage/sendAfterScheduleMessage";
import { QueueProvider } from "../../repositories/queueProvider/queueProvider";
import { SendAfterScheduleMessageJob } from "../../core/messages/useCases/afterScheduleMessage/sendAfterScheduleMessage/sendAfterScheduleMessageUseCase";
import { AfterScheduleQueue } from "./AfterScheduleQueue";

const queueProvider = new QueueProvider<SendAfterScheduleMessageJob>(
  "afterScheduleMessage",
);

const afterScheduleQueue = new AfterScheduleQueue(
  queueProvider,
  sendAfterScheduleMessageUseCase,
);

export { afterScheduleQueue };
