import { getExamUseCase } from "../core/exams/useCases/getExam";
import { watchMessageTriggersUseCase } from "../core/messageCampaign/useCases/watchMessageTriggers";
import { NotificationUndoExam } from "../core/notification/models/NotificationUndoExam";
import { scheduleNotificationUseCase } from "../core/notification/useCases/ScheduleNotification";
import { sendAndSaveNotificationUseCase } from "../core/notification/useCases/sendAndSaveNotification";
import { getPatientUseCase } from "../core/patients/controllers/getPatientController";
import { factoryEventSuggestionWithStartEndDate } from "../core/scheduling/models/EventSuggestion";
import { saveEventSuggestionUseCase } from "../core/scheduling/useCases/saveEventSuggestion";
import { appEventListener } from "../core/shared/observers/EventListener";
import { sendMessageQueue } from "../repositories/queueProvider/sendMessageQueue";

export async function start() {
  await watchMessageTriggersUseCase.execute();

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

  appEventListener.on("createBlockSchedule", async (data) => {
    try {
      const eventSuggestion = factoryEventSuggestionWithStartEndDate({
        description: data.description ?? "",
        startDate: data.date,
        endDate: data.endDate,
      });
      await saveEventSuggestionUseCase.execute(
        eventSuggestion.getDTO(),
        data.userId,
      );
    } catch (error) {
      console.error("Error creating block schedule:", error);
    }
  });
}
