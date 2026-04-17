import { ExamDTO } from "../../exams/models/Exam";
import { PatientDTO } from "../../patients/models/Patient";
import { BlockScheduleDto } from "../../scheduling/models/dtos/BlockSchedule.dto";
import { SchedulingDTO } from "../../scheduling/models/Scheduling";

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

  beforeScheduleMessageCreate: {
    id: string;
    userId: string;
    name: string;
    minutesBeforeSchedule: number;
    isActive: boolean;
  };

  beforeScheduleMessageUpdate: {
    id: string;
    userId: string;
    name: string;
    minutesBeforeSchedule: number;
    isActive: boolean;
  };

  beforeScheduleMessageDelete: {
    id: string;
  };

  // Fired after successful WhatsApp send and log persistence.
  beforeScheduleMessageSend: {
    userId: string;
    patientId: string;
    schedulingId: string;
    beforeScheduleMessageId: string;
    instanceName: string;
    toPhone: string;
    providerMessageId: string | null;
    messageLogId: string;
  };

  afterScheduleMessageCreate: {
    id: string;
    userId: string;
    name: string;
    minutesAfterSchedule: number;
    isActive: boolean;
  };

  afterScheduleMessageUpdate: {
    id: string;
    userId: string;
    name: string;
    minutesAfterSchedule: number;
    isActive: boolean;
  };

  afterScheduleMessageDelete: {
    id: string;
  };

  birthdayMessageCreate: {
    id: string;
    userId: string;
    name: string;
    isActive: boolean;
  };

  // Fired after successful WhatsApp send and log persistence.
  afterScheduleMessageSend: {
    userId: string;
    patientId: string;
    schedulingId: string;
    afterScheduleMessageId: string;
    instanceName: string;
    toPhone: string;
    providerMessageId: string | null;
    messageLogId: string;
  };

  createExam: Omit<ExamDTO, "id"> & { userId: string; examId: string };
  updateExam: Partial<Omit<ExamDTO, "id">> & { userId: string; examId: string };
  deleteExam: { userId: string; examId: string; patientId: string };

  createBlockSchedule: BlockScheduleDto & { userId: string };
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

// Minimum contract for DI.
export type IAppEventListener = Pick<typeof appEventListener, "emit">;

export { appEventListener, AppEventListener };
