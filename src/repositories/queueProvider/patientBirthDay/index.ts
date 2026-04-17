import { BirthdayMessageCampaignQueue } from "../../../queues/birthdayMessageCampaign/BirthdayMessageCampaignQueue";
import { BirthdayMessageCampaignJobData } from "../../../queues/birthdayMessageCampaign/birthdayMessageCampaignJobData";
import { QueueProvider } from "../queueProvider";
import { KnexPatientRepository } from "../../patient/KnexPatientRepository";
import { BirthdayMessageRepository } from "../../messages/BirthdayMessageRepository";
import {
  PatientsBirthDayQueue,
  PatientsBirthdayJobData,
} from "./patientsBirthDayQueue";

const queueProvider = new QueueProvider<PatientsBirthdayJobData>("birthDays");

const campaignQueueProvider = new QueueProvider<BirthdayMessageCampaignJobData>(
  "birthdayMessageCampaign",
);

const birthdayMessageCampaignQueue = new BirthdayMessageCampaignQueue(
  campaignQueueProvider,
);

const patientRepository = new KnexPatientRepository();
const birthdayMessageRepository = new BirthdayMessageRepository();

const patientsBirthDayQueue = new PatientsBirthDayQueue(
  patientRepository,
  queueProvider,
  birthdayMessageRepository,
  birthdayMessageCampaignQueue,
);

export { patientsBirthDayQueue, birthdayMessageCampaignQueue };
