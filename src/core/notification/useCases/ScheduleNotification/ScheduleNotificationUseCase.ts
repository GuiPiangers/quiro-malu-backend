import { IPushNotificationQueue } from "../../../../database/bull/pushNotifications/IPushNotificationQueue";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { SchedulingDTO } from "../../../scheduling/models/Scheduling";
import { DateTime } from "../../../shared/Date";
import { Notification } from "../../models/Notification";

export class ScheduleNotificationUseCase {
  constructor(
    private pushNotificationQueue: IPushNotificationQueue,
    private patientRepository: IPatientRepository,
  ) {}

  async schedule({ userId, ...schedule }: SchedulingDTO & { userId: string }) {
    if (!schedule.id) return;

    const [patient] = await this.patientRepository.getById(
      schedule.patientId,
      userId,
    );

    if (!patient || !schedule.date) return;

    const preTimer = 15;
    const scheduledDate = new Date(schedule.date);
    scheduledDate.setMinutes(scheduledDate.getMinutes() - preTimer);

    const scheduleDateTime = new DateTime(scheduledDate.toISOString());

    const delay = DateTime.difference(scheduleDateTime, DateTime.now());

    const notification = new Notification({
      type: "scheduling",
      message: `A consulta com o(a) paciente ${patient.name} está agendada para daqui a ${preTimer} minutos`,
      title: "A consulta está prestes a começar!",
    }).getDTO();

    this.pushNotificationQueue.add({
      delay,
      notification,
      userId,
    });
  }
}
