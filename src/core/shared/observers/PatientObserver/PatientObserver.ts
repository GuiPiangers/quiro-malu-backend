import { PatientDTO } from "../../../patients/models/Patient";
import { Observer } from "../Observer";

type ListenerParam = PatientDTO & { userId: string };

class PatientObserver extends Observer<ListenerParam> {}

export const patientObserver = new PatientObserver();
