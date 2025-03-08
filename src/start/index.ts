import { getExamUseCase } from "../core/exams/useCases/getExam";
import { NotificationUndoExam } from "../core/notification/models/NotificationUndoExam";
import { scheduleNotificationUseCase } from "../core/notification/useCases/ScheduleNotification";
import { sendAndSaveNotificationUseCase } from "../core/notification/useCases/sendAndSaveNotification";
import { getPatientUseCase } from "../core/patients/controllers/getPatientController";
import { appEventListener } from "../core/shared/observers/EventListener";

export function start() {
  appEventListener.on("createSchedule", async (data) => {
    try {
      scheduleNotificationUseCase.schedule(data);
    } catch (error) {}
  });
  appEventListener.on("deleteSchedule", async ({ id }) => {
    if (!id) return;
    try {
      scheduleNotificationUseCase.deleteSchedule({ scheduleId: id });
    } catch (error) {}
  });

  appEventListener.on("updateSchedule", async (data) => {
    try {
      scheduleNotificationUseCase.update(data);
    } catch (error) {}
  });

  appEventListener.on("deleteExam", async ({ patientId, userId, id }) => {
    try {
      if (!id) return;

      const getPatient = getPatientUseCase.execute(patientId, userId);
      const getExam = getExamUseCase.execute({ id, patientId, userId });

      const [patient, exam] = await Promise.all([getPatient, getExam]);

      const notification = new NotificationUndoExam({
        title: `Exame deletado`,
        message: `O exame "${exam.fileName}" do paciente "${patient.name}" foi deletado. Deseja restaura-lo?`,
        params: { id, patientId, userId },
        actionNeeded: false,
      });

      sendAndSaveNotificationUseCase.execute({ userId, notification });
    } catch (error) {}
  });
}
