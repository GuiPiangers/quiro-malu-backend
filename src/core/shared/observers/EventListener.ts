import { ExamDTO } from "../../exams/models/Exam";
import { MessageCampaignDTO } from "../../messageCampaign/models/MessageCampaign";
import { PatientDTO } from "../../patients/models/Patient";
import { SchedulingDTO } from "../../scheduling/models/Scheduling";

type AppEvents = {
  createPatient: PatientDTO & { userId: string };
  updatePatient: Partial<PatientDTO> & { id: string; userId: string };
  deletePatient: { userId: string; id: string };
  patientBirthDay: PatientDTO & { userId: string };

  createSchedule: SchedulingDTO & { userId: string };
  updateSchedule: SchedulingDTO & { id: string; userId: string };
  deleteSchedule: { id: string; userId: string };

  createExam: ExamDTO & { userId: string };
  updateExam: Partial<ExamDTO> & { userId: string; id: string };
  deleteExam: { userId: string; id: string; patientId: string };

  watchMessageTriggers: any;
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
