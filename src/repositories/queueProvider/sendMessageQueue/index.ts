import { sendMessageUseCase } from "../../../core/messageCampaign/useCases/sendMessage";
import { QueueProvider } from "../queueProvider";
import { SendMessageQueue, SendMessageQueuePrams } from "./sendMessageQueue";

const queueProvider = new QueueProvider<SendMessageQueuePrams>(
  "sendWhatsMessage",
);

const sendMessageQueue = new SendMessageQueue(
  queueProvider,
  sendMessageUseCase,
);

sendMessageQueue.process();

export { sendMessageQueue };
