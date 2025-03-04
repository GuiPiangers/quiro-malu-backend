import { getExamUseCase } from "../core/exams/useCases/getExam";
import { NotificationUndoExam } from "../core/notification/models/NotificationUndoExam";
import { scheduleNotificationUseCase } from "../core/notification/useCases/ScheduleNotification";
import { sendAndSaveNotificationUseCase } from "../core/notification/useCases/sendAndSaveNotification";
import { getPatientUseCase } from "../core/patients/controllers/getPatientController";
import { examObserver } from "../core/shared/observers/ExamObserver/ExamObserver";
import { schedulingObserver } from "../core/shared/observers/SchedulingObserver/SchedulingObserver";

export function start() {
  schedulingObserver.on("create", async (data) => {
    try {
      scheduleNotificationUseCase.schedule(data);
    } catch (error) {}
  });
  schedulingObserver.on("delete", async ({ id }) => {
    if (!id) return;
    try {
      scheduleNotificationUseCase.deleteSchedule({ scheduleId: id });
    } catch (error) {}
  });

  schedulingObserver.on("update", async (data) => {
    try {
      scheduleNotificationUseCase.update(data);
    } catch (error) {}
  });

  examObserver.on("delete", async ({ patientId, userId, id }) => {
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
