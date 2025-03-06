import { IQueueProvider } from "../IQueueProvider";
import { IPatientRepository } from "../../patient/IPatientRepository";
import { DateTime } from "../../../core/shared/Date";
import { patientObserver } from "../../../core/shared/observers/PatientObserver/PatientObserver";

export class PatientsBirthDayQueue {
  constructor(
    private patientRepository: IPatientRepository,
    private queueProvider: IQueueProvider<{ date: string }>,
  ) {}

  async emitBirthdays() {
    await this.queueProvider.repeat(
      { date: DateTime.now().date },
      { cron: "0 0 5 * * *", jobId: "patientsBirth" },
    );
  }

  async process() {
    await this.queueProvider.process(async (job) => {
      const birthDays = await this.patientRepository.getByDateOfBirth({
        dateOfBirth: job.date,
      });
      birthDays.forEach((patient) => {
        console.log(patient);
        patientObserver.emit("isBirthDay", patient);
      });
    });
  }
}
