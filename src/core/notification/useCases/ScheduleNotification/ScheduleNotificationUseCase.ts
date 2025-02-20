import { IPushNotificationQueue } from "../../../../database/bull/pushNotifications/IPushNotificationQueue";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { SchedulingDTO } from "../../../scheduling/models/Scheduling";
import { DateTime } from "../../../shared/Date";
import { Notification } from "../../models/Notification";

export class ScheduleNotificationUseCase {
  constructor(
    private pushNotificationQueue: IPushNotificationQueue,
    private scheduleRepository: ISchedulingRepository,
  ) {}

  async schedule({ userId, ...schedule }: SchedulingDTO & { userId: string }) {
    try {
      if (!schedule.id) return;
      const preTimer = 15;
      const maxOldDelay = 3600 * 1000; // 1 hora

      const [data] = await this.scheduleRepository.get({
        id: schedule.id,
        userId,
      });

      if (!data || !schedule.date) return;
      if (schedule.status === "Cancelado" || schedule.status === "Atendido")
        return;

      const delay = this.calculateDelay(schedule.date, preTimer);

      if (delay < -maxOldDelay) return;

      const scheduleData = new DateTime(schedule.date).date;
      const scheduleTime = new DateTime(schedule.date).time;

      const notification = new Notification({
        id: schedule.id,
        type: "scheduling",
        title: `Você tem uma consulta agendada com o(a) paciente ${data.patient}`,
        message: `A consulta com o(a) paciente ${data.patient} está agendada para às ${scheduleTime} do dia ${scheduleData}`,
      }).getDTO();

      this.pushNotificationQueue.add({
        delay,
        notification,
        userId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteSchedule({ scheduleId }: { scheduleId: string }) {
    try {
      await this.pushNotificationQueue.delete({ id: scheduleId });
    } catch (error) {
      console.log(error);
    }
  }

  async update({ userId, ...schedule }: SchedulingDTO & { userId: string }) {
    try {
      if (!schedule.id) return;

      await this.deleteSchedule({ scheduleId: schedule.id });
      await this.schedule({ userId, ...schedule });
    } catch (error) {
      console.log(error);
    }
  }

  private calculateDelay(date: string, preTimer: number) {
    const scheduledDate = new Date(date);
    scheduledDate.setMinutes(scheduledDate.getMinutes() - preTimer);

    const scheduleDateTime = new DateTime(scheduledDate.toISOString());

    const delay = DateTime.difference(scheduleDateTime, DateTime.now());
    return delay;
  }
}
