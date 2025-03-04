import { Queue, Worker } from "bullmq";

import { redis } from "../../redis";
import {
  IPatientsBirthDayQueue,
  PatientsBirthDayQueuePrams,
} from "./IPatientBirthDayQueue";
import { IPatientRepository } from "../../../repositories/patient/IPatientRepository";
import { DateTime } from "../../../core/shared/Date";

const connection = redis;

export class PatientsBirthDayQueue implements IPatientsBirthDayQueue {
  private patientsBirthQueue = new Queue("patientsBirth", { connection });

  async add({ patientRepository }: PatientsBirthDayQueuePrams) {
    await this.patientsBirthQueue.upsertJobScheduler(
      "patientsBirthDay",
      { pattern: "0 0 5 * * *" },
      { data: patientRepository },
    );
  }
}

const patientsBirthDayQueue = new PatientsBirthDayQueue();

const worker = new Worker(
  "patientsBirth",
  async (job) => {
    const patientRepository = job.data as IPatientRepository;
    const dateNow = DateTime.now();
    await patientRepository.getByDateOfBirth({ dateOfBirth: dateNow.date });
  },
  { connection },
);

worker.on("error", (error) => console.log(error));

export { patientsBirthDayQueue as pushNotificationQueue };
