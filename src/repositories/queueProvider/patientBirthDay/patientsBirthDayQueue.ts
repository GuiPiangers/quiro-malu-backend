import { computeDelayMsUntilSendTimeToday } from "../../../core/messages/utils/computeDelayMsUntilSendTimeToday";
import { DateTime } from "../../../core/shared/Date";
import { logger } from "../../../utils/logger";
import { BirthdayMessageCampaignQueue } from "../../../queues/birthdayMessageCampaign/BirthdayMessageCampaignQueue";
import { IBirthdayMessageRepository } from "../../messages/IBirthdayMessageRepository";
import { IPatientRepository } from "../../patient/IPatientRepository";
import { IQueueProvider } from "../IQueueProvider";

export type PatientsBirthdayJobData = {
  trigger: "scheduled";
};

const PATIENT_BIRTHDAY_SCAN_CRON = "0 0 4 * * *";
const PATIENT_BIRTHDAY_SCAN_TZ = "America/Sao_Paulo";

function parseCalendarDateToBirthMonthDay(calendarDate: string): {
  birthMonth: number;
  birthDay: number;
} {
  const m = `${calendarDate}`.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) {
    throw new Error(`Data de referência inválida para aniversário: ${calendarDate}`);
  }
  return { birthMonth: Number(m[2]), birthDay: Number(m[3]) };
}

export class PatientsBirthDayQueue {
  constructor(
    private patientRepository: IPatientRepository,
    private queueProvider: IQueueProvider<PatientsBirthdayJobData>,
    private birthdayMessageRepository: IBirthdayMessageRepository,
    private birthdayMessageCampaignQueue: BirthdayMessageCampaignQueue,
  ) {}


  async registerPatientBirthdayScheduler(): Promise<void> {
    try {
      await this.queueProvider.deleteRepeat({ jobId: "patientsBirthdayDaily" });
    } catch {
    }
    try {
      await this.queueProvider.removeAllRepeatableJobs();
    } catch (err) {
      logger.warn({ err }, "patientsBirthDayQueue.removeAllRepeatableJobs");
    }
    await this.queueProvider.addRepeatableCron(
      { trigger: "scheduled" },
      {
        pattern: PATIENT_BIRTHDAY_SCAN_CRON,
        tz: PATIENT_BIRTHDAY_SCAN_TZ,
      },
    );
  }

  async process(): Promise<void> {
    await this.queueProvider.process(async (_job) => {
      logger.info(
        { date: DateTime.now().date },
        "patientsBirthDayQueue scan started",
      );
      const { birthMonth, birthDay } = parseCalendarDateToBirthMonthDay(
        DateTime.now().date,
      );

      const birthDays = await this.patientRepository.getByBirthMonthAndDay({
        birthMonth,
        birthDay,
      });

      const referenceDate = DateTime.now().date;

      for (const patient of birthDays) {
        if (!patient.id) continue;
        try {
          const campaign = await this.birthdayMessageRepository.findActiveByUserId(
            patient.userId,
          );
          if (!campaign) continue;

          const delayMs = computeDelayMsUntilSendTimeToday(campaign.sendTime);
          const jobId = `birthday-campaign-${patient.id}-${referenceDate}`;

          await this.birthdayMessageCampaignQueue.scheduleDelivery(jobId, {
            userId: patient.userId,
            patientId: patient.id,
            patientName: patient.name,
            patientPhone: patient.phone ?? "",
            patientDateOfBirth: patient.dateOfBirth ?? "",
            campaignId: campaign.id,
            campaignName: campaign.name,
            textTemplate: campaign.textTemplate,
          }, delayMs);
        } catch (err) {
          logger.error(
            { err, patientId: patient.id },
            "patientsBirthday enqueue campaign failed",
          );
        }
      }

      logger.info(
        { date: DateTime.now().date, birthMonth, birthDay },
        "patientsBirthDayQueue scan finished",
      );
    });
  }
}
