import { ExamDTO } from "../../exams/models/Exam";
import { MessageCampaignDTO } from "../../messageCampaign/models/MessageCampaign";
import { Trigger } from "../../messageCampaign/models/Trigger";
import { PatientDTO } from "../../patients/models/Patient";
import { SchedulingDTO } from "../../scheduling/models/Scheduling";
import { DateTime } from "../Date";

type AppEvents = {
  createPatient: Omit<PatientDTO, "id"> & { userId: string; patientId: string };
  updatePatient: Partial<Omit<PatientDTO, "id">> & {
    patientId: string;
    userId: string;
  };
  deletePatient: { userId: string; patientId: string };
  patientBirthDay: Omit<PatientDTO, "id"> & {
    userId: string;
    patientId: string;
  };

  createSchedule: Omit<SchedulingDTO, "id"> & {
    userId: string;
    scheduleId: string;
  };
  updateSchedule: Omit<SchedulingDTO, "id"> & {
    scheduleId: string;
    userId: string;
  };
  deleteSchedule: { scheduleId: string; userId: string };

  createExam: Omit<ExamDTO, "id"> & { userId: string; examId: string };
  updateExam: Partial<Omit<ExamDTO, "id">> & { userId: string; examId: string };
  deleteExam: { userId: string; examId: string; patientId: string };

  watchTriggers: {
    userId: string;
    patientId: string;
    schedulingId?: string;
    messageCampaign: MessageCampaignDTO;
    trigger: Trigger;
    date?: DateTime;
  };
};

type Listener<T> = (data: T) => Promise<void>;

export type AvailableAppEvents = keyof AppEvents;

class AppEventListener {
  private listeners: Map<string, Array<Listener<any>>> = new Map();

  on<T extends keyof AppEvents>(
    identifier: T,
    callback: Listener<AppEvents[T]>,
  ) {
    if (!this.listeners.has(identifier)) this.listeners.set(identifier, []);

    this.listeners.get(identifier)?.push(callback);
  }

  emit<T extends keyof AppEvents>(identifier: T, data: AppEvents[T]) {
    if (this.listeners.has(identifier)) {
      this.listeners.get(identifier)?.forEach((listener) => {
        listener(data);
      });
    }
  }
}

const appEventListener = new AppEventListener();

export { appEventListener };
