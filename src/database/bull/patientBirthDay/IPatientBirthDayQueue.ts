import { IPatientRepository } from "../../../repositories/patient/IPatientRepository";

export type PatientsBirthDayQueuePrams = {
  patientRepository: IPatientRepository;
  cronPattern: string;
};

export interface IPatientsBirthDayQueue {
  add: (data: PatientsBirthDayQueuePrams) => void;
}
