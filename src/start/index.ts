import { getExamUseCase } from "../core/exams/useCases/getExam";
import { sendMessageUseCase } from "../core/messageCampaign/useCases/sendMessage";
import { watchMessageTriggersUseCase } from "../core/messageCampaign/useCases/watchMessageTriggers";
import { NotificationUndoExam } from "../core/notification/models/NotificationUndoExam";
import { scheduleNotificationUseCase } from "../core/notification/useCases/ScheduleNotification";
import { sendAndSaveNotificationUseCase } from "../core/notification/useCases/sendAndSaveNotification";
import { getPatientUseCase } from "../core/patients/controllers/getPatientController";
import { appEventListener } from "../core/shared/observers/EventListener";
import { sendMessageQueue } from "../repositories/queueProvider/sendMessageQueue";

export function start() {
  appEventListener.on("createSchedule", async (data) => {
    try {
      scheduleNotificationUseCase.schedule({ ...data, id: data.scheduleId });
    } catch (error) {}
  });
  appEventListener.on("deleteSchedule", async ({ scheduleId }) => {
    if (!scheduleId) return;
    try {
      scheduleNotificationUseCase.deleteSchedule({ scheduleId });
    } catch (error) {}
  });

  appEventListener.on("updateSchedule", async (data) => {
    try {
      scheduleNotificationUseCase.update({ ...data, id: data.scheduleId });
    } catch (error) {}
  });

  appEventListener.on("deleteExam", async ({ patientId, userId, examId }) => {
    try {
      if (!examId) return;

      const getPatient = getPatientUseCase.execute(patientId, userId);
      const getExam = getExamUseCase.execute({ id: examId, patientId, userId });

      const [patient, exam] = await Promise.all([getPatient, getExam]);

      const notification = new NotificationUndoExam({
        title: `Exame deletado`,
        message: `O exame "${exam.fileName}" do paciente "${patient.name}" foi deletado. Deseja restaura-lo?`,
        params: { id: examId, patientId, userId },
        actionNeeded: false,
      });

      sendAndSaveNotificationUseCase.execute({ userId, notification });
    } catch (error) {}
  });

  appEventListener.on(
    "watchTriggers",
    async ({
      userId,
      patientId,
      schedulingId,
      messageCampaign,
      trigger,
      date,
    }) => {
      await sendMessageQueue.add({
        userId,
        messageCampaign,
        patientId,
        schedulingId,
        trigger,
        date,
      });
    },
  );

  watchMessageTriggersUseCase.execute();
}
