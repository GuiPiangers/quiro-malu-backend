import { sendMessageUseCase } from "../../../core/messageCampaign/useCases/sendMessage";
import { QueueProvider } from "../queueProvider";
import { SendMessageJob, SendMessageQueue } from "./sendMessageQueue";

const queueProvider = new QueueProvider<SendMessageJob>("sendWhatsMessage");

const sendMessageQueue = new SendMessageQueue(queueProvider, sendMessageUseCase);

sendMessageQueue.process();

export { sendMessageQueue };
