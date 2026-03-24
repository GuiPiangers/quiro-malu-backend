import { KnexPatientRepository } from "../../repositories/patient/KnexPatientRepository";
import { MessageCampaignRepository } from "../../repositories/messageCampaign/MessageCampaignRepository";
import { BirthdayMessageConfigRepository } from "../../repositories/messageCampaign/BirthdayMessageConfigRepository";
import { QueueProvider } from "../../repositories/queueProvider/queueProvider";
import { sendMessageQueue } from "../../repositories/queueProvider/sendMessageQueue";
import { BirthdayQueue } from "./BirthdayQueue";

const queueProvider = new QueueProvider<{}>("birthdayQueue");
const birthdayMessageConfigRepository = new BirthdayMessageConfigRepository();
const messageCampaignRepository = new MessageCampaignRepository();
const patientRepository = new KnexPatientRepository();

const birthdayQueue = new BirthdayQueue(
  queueProvider,
  birthdayMessageConfigRepository,
  messageCampaignRepository,
  patientRepository,
  sendMessageQueue,
);

export { birthdayQueue };
