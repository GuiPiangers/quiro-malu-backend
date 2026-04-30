import { BirthdayMessageCampaignQueue } from "../../../queues/birthdayMessageCampaign/BirthdayMessageCampaignQueue";
import { BirthdayMessageCampaignJobData } from "../../../queues/birthdayMessageCampaign/birthdayMessageCampaignJobData";
import { QueueProvider } from "../queueProvider";
import { birthdayMessageRepository } from "../../messages/knexInstances";
import { knexPatientRepository } from "../../patient/knexInstances";
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

const patientsBirthDayQueue = new PatientsBirthDayQueue(
  knexPatientRepository,
  queueProvider,
  birthdayMessageRepository,
  birthdayMessageCampaignQueue,
);

export { patientsBirthDayQueue, birthdayMessageCampaignQueue };
