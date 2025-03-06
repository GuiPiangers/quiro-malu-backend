import { KnexPatientRepository } from "../../patient/KnexPatientRepository";
import { QueueProvider } from "../queueProvider";
import { PatientsBirthDayQueue } from "./patientsBirthDayQueue";

const queueProvider = new QueueProvider<{
  date: string;
}>("birthDays");

const patientRepository = new KnexPatientRepository();

const patientsBirthDayQueue = new PatientsBirthDayQueue(
  patientRepository,
  queueProvider,
);

patientsBirthDayQueue.process();

export { patientsBirthDayQueue };
